<template>
    <div v-show="showPassConfirm">
        <input :placeholder="$t('create.input')" v-model="pass1" type="password" />
        <input :placeholder="$t('create.again')" v-model="pass2" type="password" />
        <span @click="createAccount">{{ $t('btn.create') }}</span>
        <span @click="toggelPassConfirm">{{ $t('btn.cancel') }}</span>
    </div>
</template>

<script>
export default {
    props: {
        showPassConfirm: {
            type: Boolean,
            default: false
        },
        toggelPassConfirm: {
            type: Function,
            default: ()=>{}
        }
    },
    data() {
        return {
            pass1: '',
            pass2: ''
        };
    },
    watch: {
        showPassConfirm: function () {
            if (this.showPassConfirm) {
                return;
            }
            this.pass1 = '';
            this.pass2 = '';
        }
    },
    methods: {
        createAccount() {
            // length limit
            if (!this.pass1 || this.pass1.length < 8 || this.pass1.length > 32) {
                window.alert(this.$t('create.hint.long'));
                return;
            }

            // same password
            if (!this.pass2 || this.pass1 !== this.pass2) {
                window.alert(this.$t('create.hint.consistency'));
                return;
            }

            // ok
            this.fetchCreateAccount();
        },
        fetchCreateAccount() {
            viteWallet.Account.create(this.pass1).then(()=>{
                window.alert(this.$t('create.hint.save', {
                    '0': viteWallet.Keystore.folder
                }));
                this.toggelPassConfirm();
            }).catch((err)=>{
                console.log(err);
                window.alert('创建失败');
            });
        }
    }
};
</script>
