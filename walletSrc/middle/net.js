const loopNetTime = 2000;

class Net {
    constructor() {
        this.netStatus = false;
        this.__startLoopNet();
    }

    __setGlobalStatus(data) {
        if (global.netStatus !== data) {
            global.walletLog.info({
                info: 'netStatus change',
                netStatus: data
            });
        }
        global.netStatus = data;
    }

    __startLoopNet() {
        global.goViteIPC['p2p.NetworkAvailable']().then((data)=>{
            this.netStatus = data;
            this.__setGlobalStatus(data ? 'netOK' : 'netFail');
        }).catch(()=>{ });

        let loopTimeout = setTimeout(()=>{
            clearTimeout(loopTimeout);
            loopTimeout = null;
            this.__startLoopNet();
        }, loopNetTime);
    }

    updateFromWeb(status) {
        let text = status ? 'clientNetOK' : 'clientNetFail';
        if (global.netStatus === 'netFail' && status) {
            text = 'netFail';
        }
        this.__setGlobalStatus(text);
        !status && (this.netStatus = false);
    }

    getStatus() {
        return this.netStatus;
    }

    getLoopNetTime() {
        return loopNetTime;
    }
}

module.exports = Net;