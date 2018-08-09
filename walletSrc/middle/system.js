const { clipboard, app } = require('electron');
const { add } = require('../utils/log.js');

class System {
    constructor() {
        this.walletLog = global.walletLog;
    }

    clipboardWrite(text) {
        clipboard.writeText(text);
    }

    setLocale(locale) {
        if (global.$i18n.locale !== locale) {
            global.walletLog.info(`locale-${locale}`);
        }
        global.$i18n.locale = locale;
    }

    getLocale() {
        return app.getLocale();
    }

    log(msg) {
        add(msg);
    }
}

module.exports = System;