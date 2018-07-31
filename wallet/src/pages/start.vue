<template>
    <div class="start-wrapper">
        <div class="__btn __btn_all_in" @click="goNext">start</div>
        <div class="line"></div>
        <router-link class="__btn __btn_border" :to="{ name: 'importAccount' }">import account</router-link>
    </div>
</template>

<script>
export default {
    mounted() {
        this.getAccountList();
    },
    data() {
        return {
            accountList: null
        };
    },
    methods: {
        getAccountList() {
            viteWallet.Account.getList().then((list) => {
                this.accountList = list || [];
            });
        },
        goNext() {
            if (this.accountList === null) {
                return;
            }

            if (this.accountList.length) {
                this.$router.push({
                    name: 'login'
                });
                return;
            }

            this.$router.push({
                name: 'createAccount'
            });
        }
    }
};
</script>

<style lang="sass" scoped>
.line {
    margin: 15px 0;
    width: 100%;
    height: 2px;
    background: #E5EDF3;
}
</style>
