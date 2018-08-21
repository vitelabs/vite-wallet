const zh = require('./zh.js');
const en = require('./en.js');

module.exports = {
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
        'zh-CN': zh,
        'zh': zh,
        'en': en
    }
};