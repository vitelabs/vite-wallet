<template>
    <div class="layout-wrapper">
        <sidebar></sidebar>
        <div class="page-content">
            <div class="head">
                <div class="title">{{ title }}</div>
                <sync-block></sync-block>
                <change-lang></change-lang>
            </div>
            <slot></slot>
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
            default: ''
        }
    }
};
</script>
