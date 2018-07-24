const loopBlockTime = 2000;

class Block {
    constructor() {
        this.startHeight = '';
        this.targetHeight = '';
        this.currentHeight = '';

        this.__loopBlockTimeout = null;
        this.__startSyncBlock();
    }

    __syncBlock() {
        return global.goViteIPC['ledger.GetInitSyncInfo']().then(({ data })=>{
            this.startHeight = data.StartHeight;
            this.targetHeight = data.TargetHeight;
            this.currentHeight = data.CurrentHeight;
            return data;
        });
    }

    __startSyncBlock() {
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
                currentHeight: this.currentHeight 
            };
        }

        this.__stopSyncBlock();
        return new Promise((res, rej)=>{
            this.__syncBlock().then(()=>{
                this.__startSyncBlock();
                res({
                    startHeight: this.startHeight,
                    targetHeight: this.targetHeight,
                    currentHeight: this.currentHeight 
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
        });
    }

    getTXList({ address, pageIndex, pageNum }) {
        return global.goViteIPC['ledger.GetBlocksByAccAddr']({
            Addr: address,
            index: pageIndex,
            count: pageNum
        });
    }

    getUnconfirmedTX(address) {
        return global.goViteIPC['ledger.GetUnconfirmedInfo'](address);
    }
}

module.exports = Block;