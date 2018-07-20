<template>
    <div class="app-wrapper">
        <wallet-head/>
        <div class="content-wrapper">
            <router-view/>
        </div>
    </div>
</template>

<script>
import walletHead from 'components/head/index';

export default {
    components: {
        walletHead
    },
    mounted() {

    }
};
</script>

<style lang="sass" scoped>
.app-wrapper {
    padding: 20px;
}
.content-wrapper {
    margin-top: 20px;
    background: #dfdfdf;
}
</style>