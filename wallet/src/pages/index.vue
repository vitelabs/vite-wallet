<template>
    <div>
        <wallet-head/>
        <router-view/>
    </div>
</template>

<script>
import walletHead from 'components/head';

export default {
    components: {
        walletHead
    },
    mounted() {
        // this.$i18n.locale = 'zh';
    }
};
</script>

<style lang="sass" scoped>
</style>