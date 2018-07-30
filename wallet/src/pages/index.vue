<template>
    <div class="app-wrapper">
        <div v-if="layoutType === 'logo'" class="logo-layout">
            <change-lang></change-lang>
            <logo></logo>
            <router-view/>
        </div>

        <layout v-else :title="pageTitle" >
            <router-view/>
        </layout>
    </div>
</template>

<script>
import logo from 'components/logo.vue';
import changeLang from 'components/changeLang.vue';
import layout from 'components/layout.vue';

const pageLayouts = ['account', 'transaction'];

export default {
    components: {
        logo, changeLang, layout
    },
    mounted() {
        this.$router.beforeEach((to, from, next)=>{
            let i = pageLayouts.indexOf(to.name);

            if (i === -1) {
                this.layoutType = 'logo';
                next();
                return;
            }

            this.layoutType = 'page';
            this.pageTitle = pageLayouts[i];

            next();
        });
    },
    data() {
        return {
            layoutType: 'logo',
            pageTitle: ''
        };
    }
};
</script>

<style lang="sass" scoped>
.app-wrapper {
    padding: 20px;
}
</style>
