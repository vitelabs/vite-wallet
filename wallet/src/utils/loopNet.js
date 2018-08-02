let loopNetTimeout = null;

function startLoopNet() {
    viteWallet.EventEmitter.emit('netStatus', viteWallet.Net.getStatus());
    loopNetTimeout = window.setTimeout(() => {
        stopLoopNet();
        startLoopNet();
    }, viteWallet.Net.getLoopNetTime());
}

function stopLoopNet() {
    window.clearTimeout(loopNetTimeout);
    loopNetTimeout = null;
}

startLoopNet();