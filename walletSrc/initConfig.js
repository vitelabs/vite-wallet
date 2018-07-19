const { app } = require('electron');
const path = require('path');
const fs = require('fs');

const Config_URL = path.join(app.getAppPath(), '/walletSrc/viteWebConfig.json');

fs.writeFileSync(Config_URL, JSON.stringify({
    locale: app.getLocale(),
    env: process.env.NODE_ENV
}), 'utf-8');