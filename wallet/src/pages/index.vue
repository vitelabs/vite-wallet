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
    }
};
</script>

<style lang="sass" scoped>
</style>