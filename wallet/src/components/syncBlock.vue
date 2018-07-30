<template>
    <div class="sync-block-wrapper">
        <span v-show="statusText">{{ statusText ? $t(`nav.${statusText}`) : '' }}</span>
        <span v-show="statusText !== 'sync'">{{ blockPercent }}</span>
        <span v-show="statusText !== 'firstDone'" @click="reloadBlock">reload</span>
        <span v-show="statusText === 'firstDone'">done</span>
    </div>
</template>

<script>
let loopTimeout = null;

export default {
    data() {
        return {
            currentHeight: '',
            targetHeight: '',
            status: null,
            statusText: ''
        };
    },
    mounted() {
        this.startLoopSyncBlock();
    },
    destroyed() {
        this.stopLoopSyncBlock();
    },
    computed: {
        blockPercent() {
            if (!this.status || !this.currentHeight || !this.targetHeight) {
                return '---';
            }
            if (this.status === 2) {
                return '100%';
            }
            return this.currentHeight / this.targetHeight * 100 + '%';
        }
    },
    watch: {
        status: function(val, oldVal) {
            val === 2 && this.stopLoopSyncBlock();

            if (val === 0) {
                this.statusText = '';
                return;
            }

            if (val === 1) {
                this.statusText = 'firstDoing';
                return;
            }

            if (oldVal === null && val === 2) {
                this.statusText = 'sync';
                return;
            }

            this.statusText = 'firstDone';
            let textTimeout = window.setTimeout(()=>{
                window.clearTimeout(textTimeout);
                textTimeout = null;
                this.statusText = 'sync';
            }, 500);
        }
    },
    methods: {
        reloadBlock() {
            viteWallet.Block.reloadSyncInfo().then((data) => {
                this.syncData(data);
            }).catch((err)=>{
                console.warn(err);
            });
        },

        startLoopSyncBlock() {
            this.syncData( viteWallet.Block.getSyncInfo() );
            loopTimeout = setTimeout(()=>{
                this.stopLoopSyncBlock();
                this.startLoopSyncBlock();
            }, viteWallet.Block.getLoopBlockTime());
        },

        stopLoopSyncBlock() {
            window.clearTimeout(loopTimeout);
            loopTimeout = null;
        },

        syncData({
            targetHeight, currentHeight, status
        }) {
            this.targetHeight = targetHeight;
            this.currentHeight = currentHeight;
            this.status = status;
        }
    }
};
</script>



