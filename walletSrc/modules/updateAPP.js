const { shell, dialog } = require('electron');
const version = require('../version.json');
const request = require('../utils/http.js');

let serverStautsEvent = null;
let serverStatus = -1;
let waitForQuit = false;

module.exports = function() {
    serverStautsEvent = global.viteEventEmitter.on('serverStatus', function(status) {
        serverStatus = status;
        serverStatus === 1 && waitForQuit && quit();
    });

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

        global.walletLog.log('APP should update.');
        showDialog(data);
    }).catch(()=>{
        global.viteEventEmitter.off(serverStautsEvent);
    });
}

function showDialog({
    codeName = '', appUrl, message, isForce
}) {
    let buttons = ['download'];
    !isForce && buttons.push('no thanks');

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

        // Go-server has started to start, so wait for it to start and close it.
        if (serverStatus === 0) {
            waitForQuit = true;
            return;
        }
        quit();
    });
}

function quit() {
    global.viteEventEmitter.off(serverStautsEvent);
    global.WALLET_WIN.destroy();
}
