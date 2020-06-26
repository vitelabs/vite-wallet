
const appLocalStorage = require('./localStorage.js');
const appHttp = require('../utils/http.js');
const touchID = require('../utils/touchId');

module.exports = {
    appLocalStorage, 
    appHttp, 
    appI18n: global.$i18n,
    touchID
};