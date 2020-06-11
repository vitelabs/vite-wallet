const { dialog, app } = require('electron');

module.exports = {
    error,

    question,

    crash(message = 'crashed') {
        error({
            message,
            buttons: [global.$t('reload'), global.$t('close')]
        }).then((index) => {
            index === 0 ? app.relaunch() : app.exit(0);
        })
    },

    quit() {
        question({
            title: global.$t('close'),
            message: global.$t('quitWallet')
        }).then((id) => {
            id === 1 && global.WALLET_WIN && global.WALLET_WIN.destroy();
        });
    }
};

function error ({
    title, message, buttons
}) {
    buttons = buttons || getDefaultButtons();
    return myDialog({
        type: 'error',
        title,
        message,
        buttons
    });
}

function question ({
    buttons, title, message
}) {
    buttons = buttons || getDefaultButtons();
    return myDialog({
        type: 'question',
        buttons,
        title,
        message
    });
}

function myDialog({
    type, buttons, title='Vite Wallet', message, defaultId = 0
}) {
    if (!global.WALLET_WIN || global.WALLET_WIN.isDestroyed()) {
        return Promise.reject();
    }

    return dialog.showMessageBox(global.WALLET_WIN, {
        type, buttons, title, message, defaultId
    });
}

function getDefaultButtons() {
    return [global.$t('cancel'), global.$t('yes')];
}