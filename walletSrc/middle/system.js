const { clipboard } = require('electron');

class System {
    constructor() {}

    clipboardWrite(text) {
        clipboard.writeText(text);
    }
}

module.exports = System;