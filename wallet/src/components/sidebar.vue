<template>
    <div class="sidebar-wrapper">
        <router-link :class="{
            'icon': true,
            'home': true,
            'active': title === 'account'
        }" :to="{ name: 'account', params: { address }}"></router-link>

        <div class="__pointer icon send" :class="{
            'active': title === 'transaction'
        }" @click="goTransaction"></div>

        <div class="logout __pointer" @click="logout"></div>
    </div>
</template>

<script>
let p2pEvent = null;
let blockEvent = null;

export default {
    props: {
        title: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            address: this.$route.params.address,
            blockStatus: 0,
            p2pStatus: false
        };
    },
    mounted() {
        blockEvent = viteWallet.EventEmitter.on('blockInfo', ({ status }) => {
            this.handleBlock(status);
        });
        p2pEvent = viteWallet.EventEmitter.on('p2pStatus', (p2pStatus) => {
            this.p2pStatus = p2pStatus;
        });

        this.handleBlock( viteWallet.Block.getSyncInfo().status );
        this.p2pStatus = viteWallet.Net.getP2PStatus();
    },
    destroyed() {
        viteWallet.EventEmitter.off(p2pEvent);
        viteWallet.EventEmitter.off(blockEvent);
    },
    methods: {
        handleBlock(status) {
            this.blockStatus = status;
            this.blockStatus === 2 && viteWallet.EventEmitter.off(blockEvent);
        },

        goTransaction() {
            if (this.$route.name === 'transaction') {
                return;
            }

            if (!window.navigator.onLine) {
                window.alert(this.$t('nav.noNet'));
                return;
            }

            if (!this.p2pStatus) {
                window.alert(this.$t('nav.noP2P'));
                return;
            }

            if (this.blockStatus !== 2) {
                window.alert(this.$t('nav.sync'));
                return;
            }

            this.$router.push({
                name: 'transaction',
                params: {
                    address: this.address
                }
            });
        },
        logout() {
            viteWallet.Account.lock(this.address).then(() => {
                this.$router.push({
                    name: 'login'
                });
            }).catch((err) => {
                console.warn(err);
                window.alert(err && err.message ? err.message : this.$t('hint.logoutErr'));
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.sidebar-wrapper {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
    background: #fff;
    box-shadow: 0 2px 40px 1px rgba(221,229,252,0.50);
    .icon {
        display: inline-block;
        width: 100%;
        height: 40px;
        margin-top: 24px;
        &.active:before {
            content: '';
            display: inline-block;
            width: 4.5px;
            height: 40px;
            background-image: linear-gradient(-90deg, #1B3BD8 100%, #176CE0 100%, #0B92E7 100%, #0BB6EB 100%, #00E0F2 100%);
        }
    }
    .home {
        background: url('../assets/imgs/index_icon_default.svg') no-repeat center;
        &.active {
            background: url('../assets/imgs/index_icon_pressed.svg') no-repeat center;
        }
    }
    .send {
        background: url('../assets/imgs/send_icon_default.svg') no-repeat center;
        &.active {
            background: url('../assets/imgs/send_icon_pressed.svg') no-repeat center;
        }
    }
    .logout {
        position: absolute;
        bottom: 0;
        width: 100%;
        height: 88.5px;
        background: url('../assets/imgs/logout_icon.svg') no-repeat center;
        &:hover {
            background: url('../assets/imgs/logout_icon_hover.svg') no-repeat center;
        }
    }
}
</style>
