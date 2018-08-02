<template>
    <div class="page-layout-wrapper">
        <div class="head">
            <div @mouseenter="overLogo"  @mouseleave="leaveLogo" class="logo">
                <img src="../assets/imgs/logo_tastnet.svg" />
                <test-notice v-show="isShowNotice"></test-notice>
            </div>
            <sync-block class="sync-block"></sync-block>
            <change-lang class="change-lang"></change-lang>
        </div>
        <div class="page-wrapper">
            <sidebar class="sidebar" :title="title"></sidebar>
            <div class="page-content">
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<script>
import syncBlock from 'components/syncBlock';
import changeLang from 'components/changeLang';
import sidebar from 'components/sidebar';
import testNotice from 'components/testNotice';

export default {
    components: {
        syncBlock, changeLang, sidebar, testNotice
    },
    props: {
        title: {
            type: String,
            default: '',
        }
    },
    data() {
        return {
            isShowNotice: false
        };
    },
    methods: {
        overLogo() {
            this.isShowNotice = true;
        },
        leaveLogo() {
            this.isShowNotice = false;
        }
    }
};
</script>

<style lang="scss" scoped>
.page-layout-wrapper {
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
}
.head {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 60px;
    background-image: linear-gradient(126deg, #1B3BD8 0%, #176CE0 31%, #0B92E7 49%, #0BB6EB 71%, #00E0F2 100%);
    text-align: center;
    padding: 0 20px;
    .logo {
        display: inline-block;
        float: left;
        margin-top: 10px;
        img {
            width: 58.5px;
        }
    }
    .sync-block {
        display: inline-block;
        line-height: 60px;
    }
    .change-lang {
        display: inline-block;
        float: right;
        top: 20px;
    }
}
.page-wrapper {
    position: absolute;
    top: 60px;
    left: 0;
    right: 0;
    bottom: 0;
    background: #efefef;
    .sidebar {
        float: left;
        width: 88.5px;
    }
    .page-content {
        margin-left: 88.5px;
        height: 100%;
        overflow: auto;
    }
}
</style>
