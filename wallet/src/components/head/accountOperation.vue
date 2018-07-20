<template>
    <li class="nav-item">
        <div @click="toggleAccountList">{{ $t("nav.head.title") }}</div>
        <ul v-show="showAccountList">
            <li @click="toggelPassConfirm">{{ $t("nav.head.create") }}</li>
            <li @click="openAccountFile">{{ $t("nav.head.imported") }}</li>
            <li @click="openAccountFile">{{ $t("nav.head.backup") }}</li>
        </ul>
        <pass-confirm :showPassConfirm="showPassConfirm"
                      :toggelPassConfirm="toggelPassConfirm"></pass-confirm>
    </li>
</template>

<script>
import passConfirm from './passConfirm.vue';

export default {
    components: {
        passConfirm
    },
    data() {
        return {
            showAccountList: false,
            showPassConfirm: false,
        };
    },
    methods: {
        toggleAccountList() {
            this.showAccountList = !this.showAccountList;
        },
        toggelPassConfirm() {
            this.showPassConfirm = !this.showPassConfirm;
        },

        openAccountFile() {
            viteWallet.System.openKeystore();
        }
    }
};
</script>

