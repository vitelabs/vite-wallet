const { app } = require('electron');
const path = require('path');
const fs = require('fs');

const ENV = process.env.NODE_ENV;

// write config sync
module.exports = function(APP_PATH) {
    const Config_URL = path.join(APP_PATH, '/walletSrc/config.json');
    const config = {
        locale: app.getLocale(),
        env: ENV
    };

    fs.writeFileSync(Config_URL, JSON.stringify(config), 'utf-8');
};