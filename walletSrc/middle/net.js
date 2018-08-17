const loopP2PTime = 2000;

class Net {
    constructor() {
        this.p2pStatus = false;
        this.__startLoopP2P();
    }

    __setP2P(data) {
        this.p2pStatus !== data && global.walletLog.info({
            info: 'P2P status Change',
            p2pStatus: data ? 'P2P_netOK' : 'P2P_netFail'
        });
        this.p2pStatus = data;
    }

    __setClientNet(data) {
        global.netStatus !== data && global.walletLog.info({
            info: 'Client netStatus change',
            netStatus: data ? 'client_netOK' : 'client_NetFail'
        });
        global.netStatus = data;
    }

    __startLoopP2P() {
        global.goViteIPC['p2p.NetworkAvailable']().then((data)=>{
            this.__setP2P(data);
        }).catch(()=>{ });

        let loopTimeout = setTimeout(()=>{
            clearTimeout(loopTimeout);
            loopTimeout = null;
            this.__startLoopP2P();
        }, loopP2PTime);
    }

    updateFromWeb(status) {
        this.__setClientNet(status);
    }

    getP2PStatus() {
        return this.p2pStatus;
    }

    getLoopP2PTime() {
        return loopP2PTime;
    }
}

module.exports = Net;