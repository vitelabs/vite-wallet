<template>
    <div class="sidebar-wrapper">
        <logo></logo>
        <router-link :to="{ name: 'account', params: { address }}">home</router-link>
        <div :class="{ 'active': blockStatus === 2 && netStatus }" @click="goTransaction">send</div>
        <div @click="logout">logout</div>
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
            if (this.$route.name === 'transaction' ||
                !this.blockStatus ||
                !this.netStatus) {
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
.active {
    background: red;
}
</style>
