class Block {
    constructor() {
        this.startHeight = '';
        this.targetHeight = '';
        this.currentHeight = '';

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
        this.__syncBlock().catch(()=>{});

        let loopTimeout = setTimeout(()=>{
            clearTimeout(loopTimeout);
            loopTimeout = null;
            this.__startSyncBlock();
        }, 2000);
    }
      
    getSyncInfo(passive = true) {
        if (passive) {
            return Promise.then({
                startHeight: this.startHeight,
                targetHeight: this.targetHeight,
                currentHeight: this.currentHeight 
            });
        }
        return this.__syncBlock().then(()=>{
            return {
                startHeight: this.startHeight,
                targetHeight: this.targetHeight,
                currentHeight: this.currentHeight 
            };
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

    getBalance(address) {
        return global.goViteIPC['ledger.GetAccountByAccAddr'](address);
    }
}

module.exports = Block;