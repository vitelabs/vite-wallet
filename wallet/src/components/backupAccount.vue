<template>
    <div @click="openAccountFile">
        <span>{{ $t("nav.head.backup") }}</span>
        <img src="../assets/imgs/done_icon.svg" class="icon" />
    </div>
</template>

<script>
export default {
    methods: {
        openAccountFile() {
            viteWallet.Keystore.openFolder();
        }
    }
};
</script>

<style lang="sass" scoped>
    .icon {
        width: 9.3px;
        height: 11.3px;
        margin-bottom: -4px;
    }
</style>
