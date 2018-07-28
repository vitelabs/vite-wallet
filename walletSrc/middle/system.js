const { clipboard, app } = require('electron');

class System {
    constructor() {}

    clipboardWrite(text) {
        clipboard.writeText(text);
    }

    getLocale() {
        return app.getLocale();
    }
}

module.exports = System;