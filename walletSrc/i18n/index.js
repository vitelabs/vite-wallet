const config = require('./config.js');

class i18n {
    constructor() {
        this.locale = config.locale;
        this.fallbackLocale = config.fallbackLocale;
        this.messages = config.messages;
    }

    t (key) {
        let currentLocale = this.messages[this.locale];
        let defaultLocale = this.messages[this.fallbackLocale];

        if (!currentLocale) {
            return defaultLocale[key] || key;
        }

        let message = currentLocale[key];
        if (message) {
            return message;
        }
        
        return defaultLocale && defaultLocale[key] ? defaultLocale[key] : key;
    }
}

module.exports = i18n;