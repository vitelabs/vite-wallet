<template>
    <div class="account-list-wrapper">
        <div class="content-wrapper">
            <div>account balance: 
                <span v-for="(balanceInfo, id) in accountBalance" :key="id">
                    {{ balanceInfo.balance + ' ' + balanceInfo.tokenSymbol }}
                </span>
            </div>
            <account-list :clickAccount="toShowLogin"></account-list>
        </div>

        <login :showLogin="showLogin"
               :hideLogin="toHideLogin"
               :loginSuccess="goAccount"
               :address="activeAddress"></login>
    </div>
</template>

<script>
import login from 'components/login';
import accountList from './accountList';

let loopTime = null;

export default {
    components: {
        login, accountList
    },
    mounted() {
        this.getTotalBalance();
    },
    destroyed() {
        clearTimeout(loopTime);
        loopTime = null;
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
            let accountStatus = viteWallet.Account.status(address);
            if (!accountStatus) {
                window.alert('fail');
                return;
            }

            this.activeAddress = address;
            if (accountStatus === 'Unlocked') {
                this.goAccount();
                return;
            }

            this.activeAddress = address;
            this.showLogin = true;
        },
        toHideLogin() {
            this.activeAddress = '';
            this.showLogin = false;
        },
        getTotalBalance() {
            this.accountBalance = viteWallet.Account.getTotalBalance();

            let loopTime = setTimeout(()=>{
                clearTimeout(loopTime);
                loopTime = null;
                this.getTotalBalance();
            }, 3000);
        },
        goAccount() {
            this.$router.push({
                name: 'account',
                params: { 
                    address: this.activeAddress
                }
            });
            this.activeAddress = '';
        }
    }
};
</script>
