<template>
    <div v-show="showLogin">
        <input :placeholder="$t('create.input')" v-model="pass" type="password" />
        <span @click="login">{{ $t('btn.login') }}</span>
        <span @click="hideLogin">{{ $t('btn.cancel') }}</span>
    </div>
</template>

<script>
export default {
    props: {
        showLogin: {
            type: Boolean,
            default: false
        },
        hideLogin: {
            type: Function,
            default: ()=>{}
        },
        loginSuccess: {
            type: Function,
            default: ()=>{}
        }
    },
    data() {
        return {
            pass: ''
        };
    },
    watch: {
        showLogin: function () {
            !this.showLogin && (this.pass1 = '');
        }
    },
    methods: {
        login() {
            if (!this.pass1) {
                window.alert(this.$t('create.hint.long'));
                return;
            }

            viteWallet.Account.unLock(this.pass).then(()=>{
                this.loginSuccess && this.loginSuccess();
            }).catch((err)=>{
                window.alert(err);
            });
        }
    }
};
</script>
