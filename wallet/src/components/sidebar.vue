<template>
    <div class="sidebar-wrapper">
        <router-link :class="{
            'icon': true,
            'home': true,
            'active': title === 'account'
        }" :to="{ name: 'account', params: { address }}"></router-link>

        <div :class="{ 
            'icon': true,
            'send': true,
            'active': title === 'transaction',
            'send-active': title === 'transaction' && blockStatus === 2 && netStatus
        }" @click="goTransaction"></div>

        <div class="logout" @click="logout"></div>
    </div>
</template>

<script>
import logo from 'components/logo';

let loopBlockTimeout = null;
let loopNetTimeout = null;

export default {
    components: {
        logo
    },
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
            netStatus: false
        };
    },
    mounted() {
        this.loopBlock();
        this.loopNet();
    },
    destroyed() {
        this.stopLoopBlock();
        this.stopLoopNet();
    },
    methods: {
        goTransaction() {
            if (this.$route.name === 'transaction') {
                return;
            }

            // if (!this.blockStatus || !this.netStatus) {
            //     window.alert('no net');
            //     return;
            // }

            this.$router.push({
                name: 'transaction',
                params: {
                    address: this.address
                }
            });
        },
        logout() {
            viteWallet.Account.lock(this.address).then(()=>{
                this.$router.push({
                    name: 'login'
                });
            }).catch((err)=>{
                console.warn(err);
                window.alert(err && err.message ? err.message : 'logout fail');
            });
        },

        stopLoopBlock() {
            window.clearTimeout(loopBlockTimeout);
            loopBlockTimeout = null;
        },
        stopLoopNet() {
            window.clearTimeout(loopNetTimeout);
            loopNetTimeout = null;
        },

        loopBlock() {
            let {
                status
            } = viteWallet.Block.getSyncInfo();
            this.blockStatus = status;
            if (this.blockStatus === 2) {
                return;
            }

            loopBlockTimeout = window.setTimeout(() => {
                this.stopLoopBlock();
                this.loopBlock();
            }, viteWallet.Block.getLoopBlockTime());
        },
        loopNet() {
            this.netStatus = viteWallet.Net.getStatus();

            loopNetTimeout = window.setTimeout(() => {
                this.stopLoopNet();
                this.loopNet();
            }, viteWallet.Net.getLoopNetTime());
        }
    }
};
</script>

<style lang="sass" scoped>
.sidebar-wrapper {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
    background: #fff;
    border: 1px solid #F5F4F5;
    box-shadow: 0 2px 40px 1px rgba(221,229,252,0.50);
    .icon {
        display: inline-block;
        width: 100%;
        height: 40px;
        margin-top: 24px;
        &.active:before {
            content: '';
            display: inline-block;
            width: 6px;
            height: 40px;
            background-image: linear-gradient(-90deg, #1B3BD8 0%, #176CE0 31%, #0B92E7 49%, #0BB6EB 71%, #00E0F2 100%);
        }
    }
    .home {
        background: url('../assets/index_icon_default.svg') no-repeat center;
        &.active {
            background: url('../assets/index_icon_pressed.svg') no-repeat center;
        }
    }
    .send {
        background: url('../assets/send_icon_default.svg') no-repeat center;
        &.send-active {
            background: url('../assets/send_icon_pressed.svg') no-repeat center;
        }
    }
    .logout {
        position: absolute;
        bottom: 0;
        width: 100%;
        height: 88.5px;
        background: url('../assets/logout_icon.svg') no-repeat center;
        &:hover {
            background: url('../assets/logout_icon_hover.svg') no-repeat center;
        }
    }
}
</style>
