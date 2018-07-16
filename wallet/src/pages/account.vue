<template>
    <div class="x">
        <div class="y">account</div>
        <img src="../assets/vite-test.png" >
    </div>
</template>

<script>
export default {
    mounted() {
        // this.$i18n.locale = 'zh';
        console.log(this.$t('hello'), this.$i18n.locale);
    }
};
</script>

<style lang="scss" rel="stylesheet/scss">
.x {
    background: #f000ff;
    .y {
        color: #890908;
    }
}
</style>

