<template>
    <div>
        <div @click="goNext">start</div>
        <router-link :to="{ name: 'importAccount' }">import account</router-link>
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
