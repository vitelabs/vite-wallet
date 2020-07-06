
const appLocalStorage = require('./localStorage.js');
const touchID = require('../utils/touchId');

module.exports = {
    appLocalStorage,
    appI18n: global.$i18n,
    touchID
};