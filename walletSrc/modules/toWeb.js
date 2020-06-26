
const appLocalStorage = require('./localStorage.js');
const appHttp = require('../utils/http.js');
const { promptTouchID } = require('../utils/touchId');

module.exports = {
    appLocalStorage, 
    appHttp, 
    appI18n: global.$i18n,
    promptTouchID
};