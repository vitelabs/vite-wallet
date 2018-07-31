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

        <span class="__btn __btn_all_in" @click="createAccount">{{ $t('btn.create') }}</span>
        <router-link class="__btn_link" :to="{ name: 'login' }">login</router-link>
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
        trim(str) {
            return str.replace(/(^\s*)|(\s*$)/g, ''); 
        },
        createAccount() {
            this.name = this.trim(this.name);
            this.pass1 = this.trim(this.pass1);
            this.pass2 = this.trim(this.pass2);

            // name
            if (this.name.match(/(\s+)/g)) {
                window.alert('name is illegal');
                return;
            }

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
                window.alert('create fail');
            });
        }
    }
};
</script>

<style lang="sass" scoped>
.__btn {
    margin-bottom: 15px;
}
</style>
