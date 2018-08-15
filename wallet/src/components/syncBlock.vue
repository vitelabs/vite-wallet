<template>
    <div class="sync-block-wrapper">
        <span class="status-text" v-show="statusText !== 'sync'">
            {{ statusText ? $t(`nav.${statusText}`) : '' }}
        </span>
        <span v-show="statusText !== 'sync' && statusText !== 'noNet'">{{
            `${currentHeight} / ${targetHeight}`
        }}</span>
        <span v-show="statusText === 'sync'">
            {{ $t(`nav.blockHeight`) + ': ' + blockHeight }}
        </span>

        <img src="../assets/imgs/sync_icon.svg"
             v-show="statusText !== 'firstDone' && statusText !== 'sync'" 
             @click="reloadBlock"
             :class="{
                 'icon': true,
                 'loading': reloading || statusText === 'noNet'
        }"/>
        <img src="../assets/imgs/done_icon.svg" class="icon" v-show="statusText === 'firstDone'" />
    </div>
</template>

<script>
let netEvent = null;
let blockEvent = null;
let heightTimeout = null;

export default {
    data() {
        return {
            currentHeight: '',
            targetHeight: '',
            status: null,
            statusText: '',
            netStatus: false,
            reloading: false,

            blockHeight: '0'
        };
    },
    mounted() {
        blockEvent = viteWallet.EventEmitter.on('blockInfo', (blockInfo) => {
            this.syncData(blockInfo);
        });
        netEvent = viteWallet.EventEmitter.on('netStatus', (netStatus) => {
            this.netStatus = netStatus;
        });

        this.syncData( viteWallet.Block.getSyncInfo() );
        this.netStatus = viteWallet.Net.getStatus();

        window.addEventListener('offline',  ()=>{
            this.updateStatusText(null, false);
        });
        window.addEventListener('online',  ()=>{
            this.updateStatusText(null, true);
        });

        this.startBlockHeight();
    },
    destroyed() {
        viteWallet.EventEmitter.off(netEvent);
        viteWallet.EventEmitter.off(blockEvent);
        this.stopBlockHeight();
    },
    watch: {
        status: function(val, oldVal) {
            val === 2 && viteWallet.EventEmitter.off(blockEvent);
            this.updateStatusText(oldVal);
        }
    },
    methods: {
        reloadBlock() {
            if (this.reloading || this.statusText === 'noNet') {
                return;
            }

            this.reloading = true;
            viteWallet.Block.reloadSyncInfo().then((data) => {
                setTimeout(()=>{
                    this.reloading = false;
                }, 200);
                this.syncData(data);
            }).catch((err)=>{
                this.reloading = false;
                console.warn(err);
            });
        },

        stopBlockHeight() {
            window.clearTimeout(heightTimeout);
            heightTimeout = null;
        },
        startBlockHeight() {
            let reGet = () => {
                heightTimeout = setTimeout(()=>{
                    this.stopBlockHeight();
                    this.startBlockHeight();
                }, 2000);
            };

            viteWallet.Block.getBlockHeight().then((data) => {
                this.blockHeight = data;
                reGet();
            }).catch((err)=>{
                console.warn(err);
                reGet();
            });
        },

        updateStatusText(oldVal, clientNet = true) {
            if (!clientNet) {
                this.statusText = 'noNet';
                return;
            }

            if (this.status === 0) {
                this.statusText = '';
                return;
            }

            if (this.status === 1) {
                this.statusText = 'firstDoing';
                return;
            }

            if (!this.netStatus) {
                this.statusText = 'noNet';
                return;
            }

            if (oldVal === null && this.status === 2) {
                this.statusText = 'sync';
                return;
            }

            this.statusText = 'firstDone';
            let textTimeout = window.setTimeout(()=>{
                window.clearTimeout(textTimeout);
                textTimeout = null;
                this.statusText = 'sync';
            }, 500);
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

<style lang="scss" scoped>
.sync-block-wrapper {
    color: #fff;
    font-size: 14px;
    .status-text {
        margin-right: 10px;
    }
    .icon {
        width: 16px;
        height: 16px;
        margin-bottom: -4px;
        margin-left: 20px;
        &.loading {
            animation: rotate 0.7s linear infinite;
        }
    }
}

@keyframes rotate {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
</style>
