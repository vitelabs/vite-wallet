const { systemPreferences } = require('electron');


exports.promptTouchID = (msg) => {
    if (process.platform === 'darwin' && systemPreferences.canPromptTouchID()) {
        return systemPreferences.promptTouchID(msg);
    }
    return Promise.resolve();
}

exports.isEnableTouchID = () => {
    return global.settingsStore.get('enableTouchID');
}
