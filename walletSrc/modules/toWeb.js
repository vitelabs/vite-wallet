
const appLocalStorage = require('./localStorage.js');
const appHttp = require('../utils/http.js');

module.exports = {
    appLocalStorage, 
    appHttp, 
    appI18n: global.$i18n
};