<template>
    <div @click="openAccountFile">{{ $t("nav.head.backup") }}</div>
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
