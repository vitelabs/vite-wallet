const { systemPreferences } = require('electron');


exports.promptTouchID = (msg) => {
    if (systemPreferences.canPromptTouchID()) {
        return systemPreferences.promptTouchID(msg);
    }
    return Promise.resolve();
}
