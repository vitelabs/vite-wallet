const { shell, dialog } = require('electron');
const version = require('../version.json');
const request = require('../utils/http.js');

module.exports = function() {
    // The net module can be used after the APP is ready.
    let appEvent = null;
    global.viteEventEmitter.on('appReady', function() {
        global.viteEventEmitter.off(appEvent);
        requestUpdate();
    });
};

function requestUpdate() {
    request({
        path: '/api/walletapp/version',
        params: {
            code: version.code,
            channel: version.channel
        },
        method: 'GET'
    }).then((data)=>{
        // APP has quit
        if (!data || !global.WALLET_WIN || global.WALLET_WIN.isDestroyed()) {
            return;
        }

        let {
            code, channel
        } = data;

        let isUpdate = code > +version.code && channel === version.channel;
        if (!isUpdate) {
            return;
        }

        global.walletLog.info('APP should update.');
        showDialog(data);
    }).catch(()=>{
    });
}

function showDialog({
    codeName = '', appUrl, message, isForce
}) {
    let buttons = ['download'];
    !isForce && buttons.push('no thanks');
    global.walletLog.info(`APP update force? ${isForce}`);

    dialog.showMessageBox(global.WALLET_WIN, {
        type: 'info',
        title: `${codeName} update`,
        message: message || global.$t('updateAPP'),
        buttons,
        defaultId: 0
    }, (id) => {
        if (id !== 0) {
            return;
        }
        shell.openExternal(appUrl);

        if (!isForce) {
            return;
        }
        quit();
    });
}

function quit() {
    global.WALLET_WIN.destroy();
}
