<template>
    <div class="__index_wrapper login-wrapper">
        <div class="__btn" @click="toggleAccountList">
            <div v-show="activeAccount" class="__btn_input_active">
                <div class="name">{{activeAccount.name}}</div>
                <div class="address">{{activeAccount.address}}</div>
            </div>

            <div v-show="!activeAccount" class="__btn_input">choose account</div>

            <span :class="{ 
                'slide': true,
                'down': !isShowAccountList,
                'up': isShowAccountList
            }"></span>

            <account-list class="account-list" v-show="isShowAccountList" 
                          :accountList="accountList"
                          :clickAccount="chooseAccount"></account-list>
        </div>

        <div class="__btn __btn_input" 
             :class="{ 'active': !!password }">
            <input :placeholder="$t('create.input')" v-model="password" :type="'password'" />
        </div>

        <div class="__btn __btn_all_in" @click="login">{{ $t('btn.login') }}</div>

        <router-link class="__btn_link" :to="{ name: 'importAccount' }">import account</router-link>
    </div>
</template>

<script>
import accountList from 'components/accountList.vue';

export default {
    components: {
        accountList
    },
    mounted() {
        this.getAccountList();
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

<style lang="sass" scoped>
.login-wrapper {
    .__btn {
        position: relative;
        margin-bottom: 15px;
    }

    .slide {
        position: absolute;
        top: 19px;
        right: 17.5px;
        display: inline-block;
        width: 12px;
        height: 12px;
        &.down {
            background: url('../assets/down_icon.svg');
            background-size: 12px 12px;
        }
        &.up {
            background: url('../assets/up_icon.svg');
            background-size: 12px 12px;
        }
    }
}
</style>

<style lang="sass">
.__btn_input_active {
    border: 1px solid #D4DEE7;
    padding: 7px 40px 7px 15px;
    text-align: left;
    .address, .name {
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
    }
    .name {
        font-weight: bold;
        font-size: 14px;
        color: #333333;
        line-height: 20px;
    }
    .address {
        font-size: 12px;
        line-height: 20px;
        color: #333333;
    }
    background: #fff;
}
</style>
