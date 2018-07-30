<template>
    <div class="login-wrapper">
        <div @click="toggleAccountList">
            <div>
                <span>{{activeAccount.name}}</span>
                <span>{{activeAccount.address}}</span>
            </div>
            <span>slide</span>
        </div>

        <account-list v-show="isShowAccountList" 
                      :accountList="accountList"
                      :clickAccount="chooseAccount"></account-list>

        <input :placeholder="$t('create.input')" v-model="password" type="password" />

        <div @click="login">{{ $t('btn.login') }}</div>

        <router-link :to="{ name: 'importAccount' }">import account</router-link>
    </div>
</template>

<script>
import accountList from 'components/accountList.vue';

export default {
    mounted() {
        this.getAccountList();
    },
    components: {
        accountList
    },
    data() {
        let activeAccount;
        if (this.$route.params.address) {
            let address = this.$route.params.address;
            activeAccount = {
                address,
                name: viteWallet.Account.getName(address)
            };
        } else {
            activeAccount = viteWallet.Account.getLast();
        }

        return {
            activeAccount,
            password: '',

            accountList: [],
            isShowAccountList: false
        };
    },
    methods: {
        chooseAccount(account) {
            this.activeAccount = account;
            this.isShowAccountList = false;
        },

        toggleAccountList() {
            this.isShowAccountList = !this.isShowAccountList;
        },

        login() {
            if (!this.password) {
                window.alert(this.$t('create.hint.long'));
                return;
            }

            let address = this.activeAccount.address;
            viteWallet.Account.unLock(address, this.password).then(()=>{
                this.$router.push({
                    name: 'account',
                    params: { address }
                });
            }).catch(({ code, message })=>{
                console.warn(message);
                if (code === 4001) {
                    window.alert('password wrong');
                }
            });
        },

        getAccountList() {
            viteWallet.Account.getList().then((list) => {
                this.accountList = list || [];
                if (this.activeAccount || !this.accountList.length) {
                    return;
                }

                this.activeAccount = {
                    name: this.accountList[0].name,
                    address: this.accountList[0].address
                };
            }).catch((err) => {
                console.warn(err);
            });
        }
    }
};
</script>
