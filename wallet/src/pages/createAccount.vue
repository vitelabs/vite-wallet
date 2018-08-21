<template>
    <div class="__index_wrapper create-account-wrapper">
        <div class="__btn __btn_input" 
             :class="{ 'active': !!name || inputItem === 'name' }">
            <input ref="name" v-model="name" type='text'
                   :placeholder="$t('create.accName')"
                   @focus="inputFocus('name')"
                   @blur="inputBlur('name')" />
        </div>
        <div class="__btn __btn_input" 
             :class="{ 'active': !!pass1 || inputItem === 'pass1' }">
            <input ref="pass1" v-model="pass1" type='password'
                   :placeholder="$t('create.input')"
                   @focus="inputFocus('pass1')"
                   @blur="inputBlur('pass1')" />
        </div>
        <div class="__btn __btn_input" 
             :class="{ 'active': !!pass2 || inputItem === 'pass2' }">
            <input ref="pass2" v-model="pass2" type='password'
                   :placeholder="$t('create.again')"
                   @focus="inputFocus('pass2')"
                   @blur="inputBlur('pass2')" />
        </div>

        <span class="__btn __btn_all_in __pointer" :class="{
            'unuse': isCreating
        }" @click="createAccount">{{ $t('btn.create') + (isCreating ? '...' : '') }}</span>
        <span class="__btn_link __pointer" @click="goWhere" >{{ $t(`btn.${btn}`) }}</span>
    </div>
</template>

<script>
import Vue from 'vue';

export default {
    mounted() {
        this.focusName();
    },
    data() {
        return {
            name: '',
            pass1: '',
            pass2: '',
            btn: this.$route.params.from === 'start' ? 'back' : 'login',
            inputItem: '',
            isCreating: false
        };
    },
    methods: {
        inputFocus(text) {
            this.inputItem = text;
        },
        inputBlur(text) {
            text === this.inputItem && (this.inputItem = '');
        },
        goWhere() {
            if (this.isCreating) {
                return;
            }

            if (this.btn === 'back') {
                this.$router.go(-1);
                return;
            }
            this.$router.push({
                name: 'login'
            });
        },

        focusName() {
            Vue.nextTick(()=>{
                this.$refs.name && this.$refs.name.focus();
            });
        },
        focusPass1() {
            Vue.nextTick(()=>{
                this.$refs.pass1 && this.$refs.pass1.focus();
            });
        },
        focusPass2() {
            Vue.nextTick(()=>{
                this.$refs.pass2 && this.$refs.pass2.focus();
            });
        },

        createAccount() {
            if (this.isCreating) {
                return;
            }
            
            // [NOTICE] order fix
            // name not empty
            if (!this.name) {
                window.alert(this.$t('create.hint.nameInput'));
                this.focusName();
                return;
            }

            if ( !/^[a-zA-Z0-9_\u4e00-\u9fa5]+$/g.test(this.name) ) {
                window.alert(this.$t('create.hint.name'));
                this.focusName();
                return;
            }

            if (this.name.length > 32) {
                window.alert(this.$t('create.hint.nameLong'));
                this.focusName();
                return;
            }

            // not empty
            if (!this.pass1) {
                window.alert(this.$t('hint.pwEmpty'));
                this.focusPass1();
                return;
            }

            if ( /[\u4e00-\u9fa5]|\s+/g.test(this.pass1) ) {    // Chinese
                window.alert(this.$t('create.hint.pwFormat'));
                this.focusPass1();
                return;
            }
            // Full-width
            // if ( /[\uFF00-\uFFFF]|\s+]/g.test(this.pass1) ) {
            //     window.alert('password error');
            //     return;
            // }

            if (this.pass1.length < 1 || this.pass1.length > 32) { // length limit
                window.alert(this.$t('create.hint.long'));
                this.focusPass1();
                return;
            }

            if (!this.pass2) { // not empty
                window.alert(this.$t('create.again'));
                this.focusPass2();
                return;
            }

            if (this.pass1 !== this.pass2) { // same password
                window.alert(this.$t('create.hint.consistency'));
                this.focusPass2();
                return;
            }
            
            this.fetchCreateAccount();  // ok
        },
        fetchCreateAccount() {
            this.isCreating = true;
            viteWallet.Account.create(this.name, this.pass1).then((address)=>{
                window.alert(this.$t('create.hint.save', {
                    '0': viteWallet.Keystore.folder
                }));
                this.isCreating = false;
                this.$router.push({
                    name: 'account',
                    params: { address }
                });
            }).catch((err)=>{
                console.warn(err);
                this.isCreating = false;
                window.alert(this.$t('hint.create'));
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.__btn {
    margin-bottom: 15px;
    &.unuse {
        background: #efefef;
        color: #666;
    }
}
</style>
