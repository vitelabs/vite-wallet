<template>
    <div class="page-layout-wrapper">
        <div class="head">
            <div @mouseenter="overLogo"  @mouseleave="leaveLogo" class="logo">
                <img src="../assets/imgs/logo_tastnet.svg" />
                <div v-show="isShowNotice" class="hover-notice">
                    <div class="hover-title">test</div>
                    <div class="hover-content">test:test:test:test:test:test:test:test:test::test</div>
                </div>

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

export default {
    components: {
        syncBlock, changeLang, sidebar
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
    line-height: 60px;
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
    }
    .change-lang {
        display: inline-block;
        float: right;
        top: 20px;
    }
    .hover-notice {
        position: absolute;
        top: 49.5px;
        left: 81.75px;
        max-width: 260px;
        padding: 30px;
        background: #FFFFFF;
        border: 1px solid #E5EDF3;
        box-shadow: 0 6px 36px 0 rgba(176,192,237,0.04);
        border-radius: 8px;
        z-index: 100;
        .hover-title {
            text-align: left;
            font-size: 16px;
            line-height: 16px;
            color: #195ADD;
            margin-bottom: 16px;
            word-break: break-all;
        }
        .hover-content {
            opacity: 0.66;
            font-size: 14px;
            color: #283D4A;
            line-height: 22px;
        }
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
