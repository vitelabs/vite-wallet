const loopBlockTime = 2000;

class Block {
    constructor() {
        this.startHeight = '';
        this.targetHeight = '';
        this.currentHeight = '';
        this.isFirstSyncDone = false;
        this.isStartFirstSync = false;

        this.__loopBlockTimeout = null;
        this.__startSyncBlock();
    }

    __syncBlock() {
        return global.goViteIPC['ledger.GetInitSyncInfo']().then((data)=>{
            this.startHeight = data.StartHeight;
            this.targetHeight = data.TargetHeight;
            this.currentHeight = data.CurrentHeight;
            this.isFirstSyncDone = data.IsFirstSyncDone;
            this.isStartFirstSync = data.IsStartFirstSync;

            this.isFirstSyncDone && this.__stopSyncBlock();

            return data;
        });
    }

    __startSyncBlock() {
        if (this.isFirstSyncDone) {
            return;
        }

        let loop = ()=>{
            this.__loopBlockTimeout = setTimeout(()=>{
                this.__stopSyncBlock();
                this.__startSyncBlock();
            }, loopBlockTime);
        };

        this.__syncBlock().then(()=>{
            loop();
        }).catch(()=>{
            loop();
        });
    }

    __stopSyncBlock() {
        clearTimeout(this.__loopBlockTimeout);
        this.__loopBlockTimeout = null;
    }

    __getStatus() {
        if (this.isFirstSyncDone) {
            return 2;
        }
        if (!this.isStartFirstSync) {
            return 0;
        }
        return 1;
    }
    
    reloadSyncInfo() {
        this.__stopSyncBlock();
        return new Promise((res, rej)=>{
            this.__syncBlock().then(()=>{
                this.__startSyncBlock();
                res({
                    targetHeight: this.targetHeight,
                    currentHeight: this.currentHeight,
                    status: this.__getStatus()
                });
            }).catch((err)=>{
                this.__startSyncBlock();
                rej(err);
            });
        });
    }

    getSyncInfo() {
        return {
            targetHeight: this.targetHeight,
            currentHeight: this.currentHeight,
            status: this.__getStatus()            
        };
    }

    getLoopBlockTime() {
        return loopBlockTime;
    }

    createTX({
        selfAddr, toAddr, pass, tokenId, amount
    }) {
        return global.goViteIPC['ledger.CreateTxWithPassphrase']({
            SelfAddr: selfAddr,
            ToAddr: toAddr,
            Passphrase: pass,
            TokenTypeId: tokenId,
            Amount: amount
        });
    }

    getTXList({ address, pageIndex, pageNum }) {
        return global.goViteIPC['ledger.GetBlocksByAccAddr']({
            Addr: address,
            Index: pageIndex,
            Count: pageNum
        }).then((data)=>{
            return data || [];
        });
    }
}

module.exports = Block;