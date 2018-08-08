const { shell, dialog } = require('electron');
const version = require('../version.json');
const request = require('../utils/http.js');

module.exports = function() {
    request({
        path: '/api/walletapp/version',
        params: {
            code: version.code,
            channel: version.channel
        },
        method: 'GET'
    }).then((data)=>{
        if (!data || !global.WALLET_WIN || global.WALLET_WIN.isDestroyed()) {
            return;
        }

        let {
            code, channel, codeName, appUrl, message, isForce
        } = data;

        let isUpdate = code > +version.code && channel === version.channel;
        if (!isUpdate) {
            return;
        }

        let buttons = ['download'];
        !isForce && buttons.push('no thanks');

        dialog.showMessageBox(global.WALLET_WIN, {
            type: 'info',
            title: `${codeName} update`,
            message: message || global.$i18n('updateAPP'),
            buttons,
            defaultId: 0
        }, (id) => {
            if (id !== 0) {
                return;
            }
            shell.openExternal(appUrl);
            isForce && global.WALLET_WIN.destroy();
        });
    }).catch((err)=>{
        console.log(err);
    });
};
