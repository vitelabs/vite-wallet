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
        return global.goViteIPC['ledger.GetInitSyncInfo']().then(({ data })=>{
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
      
    getSyncInfo(passive = true) {
        if (passive) {
            return {
                startHeight: this.startHeight,
                targetHeight: this.targetHeight,
                currentHeight: this.currentHeight,
                isFirstSyncDone: this.isFirstSyncDone,
                isStartFirstSync: this.isStartFirstSync
            };
        }

        this.__stopSyncBlock();
        return new Promise((res, rej)=>{
            this.__syncBlock().then(()=>{
                this.__startSyncBlock();
                res({
                    startHeight: this.startHeight,
                    targetHeight: this.targetHeight,
                    currentHeight: this.currentHeight,
                    isFirstSyncDone: this.isFirstSyncDone,
                    isStartFirstSync: this.isStartFirstSync
                });
            }).catch((err)=>{
                rej(err);
                this.__startSyncBlock();
            });
        });
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
        }).then(({ data })=>{
            return data;
        });
    }

    getTXList({ address, pageIndex, pageNum }) {
        return global.goViteIPC['ledger.GetBlocksByAccAddr']({
            Addr: address,
            Index: pageIndex,
            Count: pageNum
        }).then(({ data })=>{
            return data || [];
        });
    }

    getUnconfirmedTX(address) {
        return global.goViteIPC['ledger.GetUnconfirmedInfo'](address).then(({ data })=>{
            return data;
        });
    }
}

module.exports = Block;