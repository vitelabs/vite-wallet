const { clipboard, app } = require('electron');
const { add } = require('../utils/log.js');

class System {
    constructor() {}

    clipboardWrite(text) {
        clipboard.writeText(text);
    }

    setLocale(locale) {
        if (global.userLocale !== locale) {
            global.walletLog.info(`locale-${locale}`);
        }
        global.userLocale = locale;
    }

    getLocale() {
        return app.getLocale();
    }

    log(msg) {
        add(msg);
    }    
}

module.exports = System;