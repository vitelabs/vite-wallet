<template>
    <li>
        <div @click="toggleLangList">{{ $t('lang') }}</div>
        <ul v-show="showLang">
            <li v-for="(key, index) in messages" :key="index" 
                @click="changeLocale(index)">{{key.lang}}</li>
        </ul>
    </li>
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
        }
    }
};
</script>

