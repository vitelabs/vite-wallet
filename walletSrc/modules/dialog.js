const { dialog, app } = require('electron');

module.exports = {
    error,

    question,

    crash(message = 'crashed') {
        error({
            message,
            buttons: [global.$t('reload'), global.$t('close')]
        }, function (index) {
            (index === 0) && app.relaunch();
            app.exit(0);
        });
    },

    quit() {
        question({
            title: global.$t('close'),
            message: global.$t('quitWallet')
        }, (id) => {
            id === 1 && global.WALLET_WIN && global.WALLET_WIN.destroy();
        });
    }
};

function error ({
    title, message, buttons
}, cb) {
    buttons = buttons || getDefaultButtons();
    myDialog({
        type: 'error',
        title,
        message,
        buttons
    }, cb);
}

function question ({
    buttons, title, message
}, cb) {
    buttons = buttons || getDefaultButtons();
    myDialog({
        type: 'question',
        buttons,
        title,
        message
    }, cb);
}

function myDialog({
    type, buttons, title='Vite Wallet', message, defaultId = 0
}, cb) {
    if (!global.WALLET_WIN) {
        return;
    }

    dialog.showMessageBox(global.WALLET_WIN, {
        type, buttons, title, message, defaultId
    }, cb);
}

function getDefaultButtons() {
    return [global.$t('cancel'), global.$t('yes')];
}