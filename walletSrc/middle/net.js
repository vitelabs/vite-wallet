const loopNetTime = 2000;

class Net {
    constructor() {
        this.netStatus = false;
        this.__startLoopNet();
    }

    __startLoopNet() {
        global.goViteIPC['p2p.NetworkAvailable']().then((data)=>{
            this.netStatus = data;
        }).catch(()=>{ });

        let loopTimeout = setTimeout(()=>{
            clearTimeout(loopTimeout);
            loopTimeout = null;
            this.__startLoopNet();
        }, loopNetTime);
    }

    updateFromWeb(status) {
        global.netStatus = status;
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