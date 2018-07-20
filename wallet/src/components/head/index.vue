<template>
    <header class="head-wrapper">
        <img src="../../assets/vite-test.png" >

        <ul class="nav-list">
            <li class="nav-item" @click="goHome">{{ $t("nav.home") }}</li>
            <account-operation></account-operation>
            <sync-block></sync-block>
            <change-lang></change-lang>
        </ul>
    </header>
</template>

<script>
import accountOperation from './accountOperation.vue';
import changeLang from './changeLang.vue';
import syncBlock from './syncBlock.vue';

export default {
    components: {
        accountOperation, changeLang, syncBlock
    },
    methods: {
        goHome() {
            this.$router.push({
                name: 'accountList'
            });
        }
    }
};
</script>

<style lang="sass" scoped>
.head-wrapper {
    background: #dfdfdf;
}

.nav-list {
    display: inline-block;
    .nav-item {
        display: inline-block;
    }
}
</style>
