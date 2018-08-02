<template>
    <div class="app-wrapper">
        <index-layout v-if="layoutType === 'logo'">
            <router-view/>
        </index-layout>

        <page-layout v-else :title="pageTitle" >
            <router-view/>
        </page-layout>
    </div>
</template>

<script>
import indexLayout from 'components/indexLayout.vue';
import pageLayout from 'components/pageLayout.vue';

const pageLayouts = ['account', 'transaction'];

export default {
    components: {
        indexLayout, pageLayout
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
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: auto;
}
</style>