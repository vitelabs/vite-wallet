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
    requestUpdate();
};

function requestUpdate() {
    // showDialog({});
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

        showDialog(data);
    }).catch((err)=>{
        global.viteEventEmitter.off(serverStautsEvent);
        console.log(err);
    });
}

function showDialog({
    codeName = '', appUrl = 'https://vite.test.net', message= 'sdsdsds', isForce= true
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

        // Go-server has started, so waiting for it to finish.
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
