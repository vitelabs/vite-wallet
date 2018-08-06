const { clipboard, app } = require('electron');
const { add } = require('../utils/log.js');

class System {
    constructor() {}

    clipboardWrite(text) {
        clipboard.writeText(text);
    }

    getLocale() {
        return app.getLocale();
    }

    log(msg) {
        add(msg);
    }
}

module.exports = System;