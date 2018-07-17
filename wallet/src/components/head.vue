<template>
    <header>
        <span>Vite Logo</span>

        <ul class="nav-list">
            <li class="nav-item">{{ $t("nav.home") }}</li>
            <li class="nav-item">
                <div @click="toggleAccountList">{{ $t("nav.head.title") }}</div>
                <ul v-show="showAccountList">
                    <li @click="toggelPassConfirm">{{ $t("nav.head.create") }}</li>
                    <li @click="openAccountFile">{{ $t("nav.head.imported") }}</li>
                    <li @click="openAccountFile">{{ $t("nav.head.backup") }}</li>
                </ul>
            </li>
        </ul>

        <div>
            <span>{{ $t("nav.sync") }}</span>
            <span>{{ blockPercent }}</span>
        </div>

        <div v-show="showPassConfirm">
            <input :placeholder="$t('create.input')" v-model="pass1" type="text" />
            <input :placeholder="$t('create.again')" v-model="pass2" type="text" />
            <span @click="createAccount">{{ $t('btn.create') }}</span>
            <span @click="toggelPassConfirm">{{ $t('btn.cancel') }}</span>
        </div>
    </header>
</template>

<script>
export default {
    data() {
        return {
            showAccountList: false,
            showPassConfirm: false,
            pass1: '',
            pass2: '',
            blockPercent: '0%'
        };
    },
    methods: {
        toggleAccountList() {
            this.showAccountList = !this.showAccountList;
        },
        toggelPassConfirm() {
            this.showPassConfirm = !this.showPassConfirm;
            if (this.showPassConfirm) {
                return;
            }
            this.pass1 = '';
            this.pass2 = '';
        },

        openAccountFile() {
            // localAPI.openAccountFile().then((msg)=>{
            //     console.log(msg);
            // }).catch((err)=>{
            //     console.log(err);
            // });
        },
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
            localAPI.createAccount(this.pass1).then((msg)=>{
                console.log(msg);
            }).catch((err)=>{
                console.log(err);
            });
        },
        fetchSyncBlock() {
            // localAPI.syncBlock().then((msg)=>{
            //     console.log(msg);
            // }).catch((err)=>{
            //     console.log(err);
            // });
        }
    }
};
</script>

<style lang="sass" scoped>
.nav-list {
    display: inline-block;
    .nav-item {
        display: inline-block;
    }
}
</style>
