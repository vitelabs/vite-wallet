let loopP2PTimeout = null;

function startLoopP2P() {
    viteWallet.EventEmitter.emit('p2pStatus', viteWallet.Net.getP2PStatus());
    loopP2PTimeout = window.setTimeout(() => {
        stopLoopP2P();
        startLoopP2P();
    }, viteWallet.Net.getLoopP2PTime());
}

function stopLoopP2P() {
    window.clearTimeout(loopP2PTimeout);
    loopP2PTimeout = null;
}

startLoopP2P();