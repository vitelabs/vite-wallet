<template>
    <li class="sync-block-wrapper">
        <span v-show="status">{{ $t(`nav.${status}`) }}</span>
        <span v-show="!isFirstSyncDone">{{ blockPercent }}</span>
        <span v-show="!isFirstSyncDone" @click="reloadBlock">reload</span>
        <span v-show="isFirstSyncDone">done</span>
    </li>
</template>

<script>
let loopTimeout = null;

export default {
    data() {
        return {
            currentHeight: '',
            startHeight: '',
            targetHeight: '',

            isFirstSyncDone: false,
            status: ''
        };
    },
    mounted() {
        this.getSyncBlock();
    },
    destroyed() {
        window.clearTimeout(loopTimeout);
        loopTimeout = null;
    },
    computed: {
        blockPercent() {
            if (!this.status ||
                !this.currentHeight || !this.startHeight || !this.targetHeight || 
                !(this.targetHeight - this.startHeight)) {
                return '---';
            }
            return (this.currentHeight - this.startHeight) / (this.targetHeight - this.startHeight) * 100 + '%';
        }
    },
    methods: {
        reloadBlock() {
            viteWallet.Block.getSyncInfo(false).then((data) => {
                this.syncData(data);
            }).catch((err)=>{
                console.warn(err);
            });
        },
        getSyncBlock() {
            if (this.isFirstSyncDone) {
                this.status = 'firstDone';

                let statusTimeout = window.setTimeout(()=>{
                    window.clearTimeout(statusTimeout);
                    statusTimeout = null;
                    this.status = 'sync';
                }, 1000);

                return;
            }

            this.syncData( viteWallet.Block.getSyncInfo() );

            loopTimeout = setTimeout(()=>{
                window.clearTimeout(loopTimeout);
                loopTimeout = null;
                this.getSyncBlock();
            }, 2000);
        },

        syncData({
            startHeight, targetHeight, currentHeight, isStartFirstSync, isFirstSyncDone
        }) {
            this.startHeight = startHeight;
            this.targetHeight = targetHeight;
            this.currentHeight = currentHeight;
            this.isFirstSyncDone = isFirstSyncDone;

            isStartFirstSync && (this.status = 'firstDoing');
        }
    }
};
</script>



