const { app } = require('electron');

// Single app instance
const isSecondInstance = app.makeSingleInstance(() => {
    // Someone tried to run a second instance, we should focus our window.
    if (!global.WALLET_WIN) {
        return;
    }

    global.WALLET_WIN.isMinimized() && global.WALLET_WIN.restore();
    global.WALLET_WIN.focus();
});
isSecondInstance && app.quit();

module.exports = function (cb) {
    app.on('ready', function () {
        global.$i18n.setLocale( app.getLocale() );
        cb && cb();
    });

    app.on('gpu-process-crashed', () => {
        global.dialog.crash('gpu-process-crashed');
        global.walletLog.info('gpu-process-crashed', false);
    });
};
