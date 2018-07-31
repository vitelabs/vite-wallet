<template>
    <div class="login-wrapper">
        <div class="__btn" @click="toggleAccountList">
            <div v-show="activeAccount" class="__btn_input_active">
                <span class="name">{{activeAccount.name}}</span>
                <span class="address">{{activeAccount.address}}</span>
            </div>

            <div v-show="!activeAccount" class="__btn_input">choose account</div>

            <span :class="{ 
                'slide': true,
                'down': !isShowAccountList,
                'up': isShowAccountList
            }"></span>
        </div>

        <account-list v-show="isShowAccountList" 
                      :accountList="accountList"
                      :clickAccount="chooseAccount"></account-list>

        <div class="__btn __btn_input" >
            <input :placeholder="$t('create.input')" 
                   v-model="password" type="password" />
        </div>

        <div class="__btn __btn_all_in" @click="login">{{ $t('btn.login') }}</div>

        <router-link class="import-account" :to="{ name: 'importAccount' }">import account</router-link>
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


<style lang="sass" scoped>
.login-wrapper {
    .import-account {
        text-align: center;
        font-size: 14px;
        color: #195BDD;
    }

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

.__btn_input {
    padding: 0 16px;
    input {
        width: 100%;
        font-size: 14px;
    }
}
</style>

<style lang="sass">
.__btn_input_active {
    padding: 7px 15px;
    .name {
        font-size: 12px;
        color: #333333;
    }
    .address {
        font-size: 10px;
        color: #333333;
    }
    background: #fff;
}
.__btn_input_active:hover {
    background: #232738;
}
</style>

