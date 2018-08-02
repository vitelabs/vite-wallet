<template>
    <div @click="openAccountFile">
        <span>{{ $t("nav.head.backup") }}</span>
        <img src="../assets/imgs/save_icon.svg" class="icon" />
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
