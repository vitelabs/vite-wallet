<template>
    <li class="nav-item">
        <div @click="toggleAccountList">{{ $t("nav.head.title") }}</div>
        <ul v-show="showAccountList">
            <li @click="toggelPassConfirm">{{ $t("nav.head.create") }}</li>
            <li @click="openDragFile">{{ $t("nav.head.imported") }}</li>
            <li @click="openAccountFile">{{ $t("nav.head.backup") }}</li>
        </ul>
        <pass-confirm :showPassConfirm="showPassConfirm"
                      :toggelPassConfirm="toggelPassConfirm"></pass-confirm>
        <drag-file :show="showDragFile"
                   :toHide="toHideDragFile"></drag-file>
    </li>
</template>

<script>
import passConfirm from 'components/passConfirm.vue';
import dragFile from 'components/dragFile.vue';

export default {
    components: {
        passConfirm, dragFile
    },
    data() {
        return {
            showAccountList: false,
            showPassConfirm: false,
            showDragFile: false
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
            viteWallet.Keystore.openFolder();
        },
        openDragFile() {
            this.showDragFile = true;
        },
        toHideDragFile() {
            this.showDragFile = false;
        }
    }
};
</script>
