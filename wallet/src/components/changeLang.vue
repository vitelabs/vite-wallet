<template>
    <div class="change-lang-wrapper">
        <div @click="toggleLangList">{{ $t('lang') }}</div>
        <ul class="lang-list" v-show="showLang">
            <li v-for="(key, index) in messages" v-show="key.lang !== $t('lang')" :key="index" 
                @click="changeLocale(index)">{{key.lang}}</li>
        </ul>
    </div>
</template>

<script>
export default {
    data() {
        return {
            showLang: false,
            messages: this.$i18n.messages
        };
    },
    methods: {
        toggleLangList() {
            this.showLang = !this.showLang;
        },
        changeLocale(locale) {
            this.$i18n.locale = locale;
            viteWallet.System.setLocale(locale);
            viteWallet.EventEmitter.emit('changeLang', locale);
            this.toggleLangList();
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";

.change-lang-wrapper {
    position: relative;
    font-size: 14px;
    color: #FFFFFF;
    letter-spacing: 0;
    width: 80px;
    text-align: right;
    height: 20px;
    line-height: 20px;
    font-family: $font-bold;
}
.lang-list {
    position: absolute;
    top: 20px;
    right: 0;
}
</style>
