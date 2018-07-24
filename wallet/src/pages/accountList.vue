<template>
    <div class="account-list-wrapper">
        <div class="content-wrapper">
            <div>account balance: 
                <span v-show="!accountBalance.length">0</span>
                <span v-show="accountBalance.length" v-for="(balanceInfo, id) in accountBalance" :key="id">
                    {{ balanceInfo.balance + ' ' + balanceInfo.tokenSymbol }}
                </span>
            </div>
            <account-list :clickAccount="toShowLogin"></account-list>
        </div>

        <login :showLogin="showLogin"
               :hideLogin="toHideLogin"
               :loginSuccess="goAccount"></login>
    </div>
</template>

<script>
import login from 'components/login';
import accountList from 'components/accountList';

export default {
    components: {
        login, accountList
    },
    mounted() {
        this.getTotalBalance();
    },
    data() {
        return {
            accountBalance: 0,
            activeAddress: '',
            showLogin: false
        };
    },
    methods: {
        toShowLogin(address) {
            this.activeAddress = address;
            this.showLogin = true;
        },
        toHideLogin() {
            this.activeAddress = '';
            this.showLogin = false;
        },
        getTotalBalance() {
            this.accountBalance = viteWallet.Account.getTotalBalance();
        },
        goAccount() {
            this.$router.push({
                name: 'account',
                params: { 
                    address: this.activeAddress
                }
            });
        }
    }
};
</script>
