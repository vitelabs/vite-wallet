const { clipboard, app } = require('electron');

class System {
    constructor() {
        this.walletLog = global.walletLog;
    }

    clipboardWrite(text) {
        clipboard.writeText(text);
    }

    setLocale (locale) {
        global.$i18n.setLocale(locale);
    }

    getLocale() {
        return app.getLocale();
    }
}

module.exports = System;