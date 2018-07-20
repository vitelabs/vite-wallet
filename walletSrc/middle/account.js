const { app } = require('electron');
const fs = require('fs');
const path = require('path');
const accountNameFile = path.join(app.getPath('appData'), 'viteWallet_AccountName');

class Account {
    constructor() {
        this.__AccountList = {};
        this.__AccountNum = 0;

        fs.exists(accountNameFile, (result)=>{
            if (!result) {
                return;
            } else {
                let result = fs.readFileSync(accountNameFile, {
                    encoding: 'utf8'
                });
                let obj;
                try {
                    obj = JSON.parse(result);
                } catch (error) {
                    obj = {
                        accountNameList: [],
                        accountNum: 0
                    };
                }

                this.__AccountList = obj.accountNameList;
                this.__AccountNum = obj.accountNum;
            }
        });

        this.__startLoopAccounts();
    }

    __startLoopAccounts() {
        global.goViteIPC['wallet.ListAddress']().then(({ data })=>{
            let isChange = false;
            data.forEach(ele => {
                // already have name
                if (this.__AccountList[ele] && this.__AccountList[ele].name) {
                    return;
                }
                isChange = true;
                this.__AccountList[ele] = this.__AccountList[ele] || {};
                this.__AccountList[ele].name = `account${++this.__AccountNum}`;
            });

            isChange && this.__writeFile();
        }).catch(()=>{});

        let loopTimeout = setTimeout(()=>{
            clearTimeout(loopTimeout);
            loopTimeout = null;
            this.__startLoopAccounts();
        }, 3000);
    }

    __writeFile() {
        let nameList = {};
        for(let address in this.__AccountList) {
            nameList[address] = this.__AccountList[address].name;
        }
        fs.writeFile(accountNameFile, JSON.stringify({
            accountNameList: nameList,
            accountNum: this.__AccountNum
        }), 'utf8');
    }

    create(pass) {
        return global.goViteIPC['wallet.NewAddress'](pass);
    }

    get(address) {
        if (!this.__AccountList(address)) {
            return Promise.reject({
                code: -3000,
                msg: 'no account'
            });
        }

        // let account = {
        //     address,
        //     name: this.__AccountList[address]
        // };
        // return new Promise((res, rej)=>{
        //     Promise.all([
        //         global.goViteIPC('ledger.GetAccountByAccAddr', address),
        //         global.goViteIPC('ledger.GetUnconfirmedInfo', address)
        //     ]).then((data)=>{
                
        //     }).catch((err)=>{
        //         // res(account)
        //     });
        // });
    }

    rename(address, name) {
        if (!this.__AccountList[address]) {
            return false;
        }

        this.__AccountList[address].name = name;
        this.__writeFile();
        return true;
    }

    getList() {
        return this.__AccountList;
    }

    unLock(address, pass) {
        return global.goViteIPC['wallet.UnLock']([address, pass]);
    }

    status() {
        return global.goViteIPC['wallet.Status']();
    }

    lock(address) {
        return global.goViteIPC['wallet.Lock'](address);
    }

    reloadFile() {
        return global.goViteIPC['wallet.ReloadAndFixAddressFile']();
    }

    isValidFile(path) {
        return global.goViteIPC['wallet.IsMayValidKeystoreFile'](path);
    }
}

module.exports = Account;