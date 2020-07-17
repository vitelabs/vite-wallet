const { systemPreferences, MenuItem, Menu } = require('electron');

const menu = new Menu();
menu.append(new MenuItem({ label: global.$t('copy'), role: 'copy' }));
menu.append(new MenuItem({ label: global.$t('cut'), role: 'cut' }));
menu.append(new MenuItem({ label: global.$t('paste'), role: 'paste' }));
menu.append(new MenuItem({ label: global.$t('selectAll'), role: 'selectall' }));

exports.promptTouchID = (msg) => {
    if (process.platform === 'darwin' && systemPreferences.canPromptTouchID()) {
        return systemPreferences.promptTouchID(msg);
    }
    return Promise.resolve();
};

exports.isEnableTouchID = () => {
    return global.settingsStore.get('enableTouchID');
};

exports.popupMenu = function() {
    menu.popup(global.WALLET_WIN);
};
