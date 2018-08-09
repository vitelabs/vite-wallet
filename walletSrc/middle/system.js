const { clipboard, app } = require('electron');
const { add } = require('../utils/log.js');

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

    log(msg) {
        add(msg);
    }
}

module.exports = System;