<template>
    <div class="__index_wrapper create-account-wrapper">
        <div class="__btn __btn_input" 
             :class="{ 'active': !!name }">
            <input :placeholder="'account name'" v-model="name" type='text' />
        </div>
        <div class="__btn __btn_input" 
             :class="{ 'active': !!pass1 }">
            <input :placeholder="$t('create.input')" v-model="pass1" :type="'password'" />
        </div>
        <div class="__btn __btn_input" 
             :class="{ 'active': !!pass2 }">
            <input :placeholder="$t('create.again')" v-model="pass2" :type="'password'" />
        </div>

        <span class="__btn __btn_all_in __pointer" @click="createAccount">{{ $t('btn.create') }}</span>
        <router-link class="__btn_link" :to="{ name: 'login' }">{{ $t('btn.login') }}</router-link>
    </div>
</template>

<script>
export default {
    data() {
        return {
            name: '',
            pass1: '',
            pass2: ''
        };
    },
    methods: {
        createAccount() {
            // [NOTICE] order fix
            // name not empty
            if (!this.name) {
                window.alert(this.$t('hint.acEmpty'));
                return;
            }

            if (this.name.match(/(\s+)/g) ||
                this.name.length > 32) {
                window.alert(this.$t('create.hint.name'));
                return;
            }

            // not empty
            if (!this.pass1) {
                window.alert(this.$t('hint.pwEmpty'));
                return;
            }

            // Chinese
            if ( /[\u4e00-\u9fa5]|\s+/g.test(this.pass1) ) {
                window.alert(this.$t('create.hint.pwFormat'));
                return;
            }
            // Full-width
            // if ( /[\uFF00-\uFFFF]|\s+]/g.test(this.pass1) ) {
            //     window.alert('password error');
            //     return;
            // }

            // length limit
            if (this.pass1.length < 1 || this.pass1.length > 32) {
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
            viteWallet.Account.create(this.name, this.pass1).then((address)=>{
                window.alert(this.$t('create.hint.save', {
                    '0': viteWallet.Keystore.folder
                }));
                this.$router.push({
                    name: 'account',
                    params: { address }
                });
            }).catch((err)=>{
                console.warn(err);
                window.alert(this.$t('hint.create'));
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.__btn {
    margin-bottom: 15px;
}
</style>
