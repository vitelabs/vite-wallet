const { readAccountNamesSync, writeAccountNames } = require('../utils/accountNames.js');
const ERRORS = require('../utils/errors.js');

const accNamePre = 'account';
const loopAddrListTime = 5000;
const loopBalanceListTime = 5000;

class Account {
    constructor() {
        // name / balance
        this.__accountsMap = {};
        this.__nameCount = 0;
        this.__totalBalance = 0;

        // init account names
        let names = readAccountNamesSync();
        if (names.namesMap) {
            let namesMap = names.namesMap;
            for (let address in namesMap) {
                this.__accountsMap[address] = {
                    name: namesMap[address]
                };
            }
        }
        this.__nameCount = names.nameCount || 0;

        // start loop address list => check user names
        this.__loopAddressList();
        
        // start loop balance list => computed tatal balance
        this.__loopBalanceList();

        // start loop account-status
        this.__loopStatusList();
    }

    __loopAddressList() {
        let timeoutLoop = ()=>{
            let loopTimeout = setTimeout(()=>{
                clearTimeout(loopTimeout);
                loopTimeout = null;
                this.__loopAddressList();
            }, loopAddrListTime);
        };

        global.goViteIPC['wallet.ListAddress']().then(({ data })=>{
            let isChange = false;

            data.forEach(address => {
                // already have name
                if (this.__accountsMap[address] && this.__accountsMap[address].name) {
                    return;
                }
    
                isChange = true;
                this.__accountsMap[address] = this.__accountsMap[address] || {};
                this.__accountsMap[address].name = `${accNamePre}${++this.__nameCount}`;
            });

            // Write name-file only when data changes
            isChange && writeAccountNames(this.__accountsMap);

            timeoutLoop();
        }).catch(()=>{
            timeoutLoop();
        });
    }

    __loopBalanceList() {
        let timeoutLoop = ()=>{
            let loopTimeout = setTimeout(()=>{
                clearTimeout(loopTimeout);
                loopTimeout = null;
                this.__loopBalanceList();
            }, loopBalanceListTime);
        };

        let proList = [];
        for (let address in this.__accountsMap) {
            proList.push(global.goViteIPC['ledger.GetAccountByAccAddr'](address));
        }

        if (!proList.length) {
            timeoutLoop();
            return;
        }

        Promise.all(proList).then(({ data })=>{
            let totalBalance = {};

            data.forEach((account) => {
                if (!this.__accountsMap[account.address]) {
                    return;
                }

                let balanceInfos = account.BalanceInfos ? account.BalanceInfos || [] : [];
                this.__accountsMap[account.address].balanceInfos = balanceInfos;
                this.__accountsMap[account.address].BlockHeight = account.BlockHeight || '';

                balanceInfos.forEach((balanceInfo) => {
                    let id = balanceInfo.TokenTypeId;

                    if (totalBalance[id]) {
                        // [TODO] bignumber
                        totalBalance[id].balance += balanceInfo.Balance;
                        return;
                    }

                    totalBalance[balanceInfo.id] = {
                        tokenSymbol: balanceInfo.TokenSymbol,
                        tokenName: balanceInfo.TokenName,
                        balance: balanceInfo.Balance
                    };
                });
            });
            
            this.__totalBalance = totalBalance;

            timeoutLoop();
        }).catch(()=>{
            timeoutLoop();
        });
    }

    __loopStatusList() {
        let timeoutLoop = ()=>{
            let loopTimeout = setTimeout(()=>{
                clearTimeout(loopTimeout);
                loopTimeout = null;
                this.__loopStatusList();
            }, loopAddrListTime);
        };

        global.goViteIPC['wallet.Status']().then(({ data })=>{
            for (let address in data) {
                if(!this.__accountsMap[address]) {
                    return;
                }
                this.__accountsMap[address].status = data[address];
            }
            timeoutLoop();
        }).catch(()=>{
            timeoutLoop();
        });
    }

    create(pass) {
        console.log(pass);
        return global.goViteIPC['wallet.NewAddress'](pass);
    }

    get(address) {
        if (!this.__accountsMap[address]) {
            return Promise.reject( ERRORS.NO_DATA('account') );
        }

        return new Promise((res, rej)=>{
            global.goViteIPC('ledger.GetUnconfirmedInfo', address).then(({
                data
            }) => {
                res({
                    name: this.__accountsMap[address].name || '',
                    balanceInfos: this.__accountsMap[address].balanceInfos || [],
                    fundFloat: data
                });
            }).catch((err)=>{
                rej(err);
            });
        });
    }

    rename(address, name) {
        if (!this.__accountsMap[address]) {
            return false;
        }

        this.__accountsMap[address].name = name;
        writeAccountNames(this.__accountsMap);
        return true;
    }

    getList({ pageIndex, pageNum }) {
        let startInx = pageIndex * pageNum;
        let endInx = (pageIndex + 1) * pageNum;
        let count = 0;

        let proList = [];

        for(let address in this.__accountsMap) {
            if (count >= endInx) {
                break;
            }
            if (count < startInx) {
                continue;
            }

            count++;
            proList.push( global.goViteIPC['ledger.GetUnconfirmedInfo'](address) );
        }

        if (!proList.length) {
            return Promise.resolve({
                code: 0,
                data: []
            });
        }

        return Promise.all(proList).then((data) => {
            let accountList = [];

            data.forEach((unconfBlock)=>{
                let address = unconfBlock.Addr;

                // This account already disappear.
                if (!this.__accountsMap[address]) {
                    return;
                }

                accountList.push({
                    address,
                    unconfBlock,
                    name: this.__accountsMap[address].name,
                    balanceInfos: this.__accountsMap[address].balanceInfos,
                    status: this.__accountsMap[address].status
                });
            });

            return accountList;
        });
    }

    unLock(address, pass) {
        return global.goViteIPC['wallet.UnLock']([address, pass]);
    }

    lock(address) {
        return global.goViteIPC['wallet.Lock'](address);
    }

    status(address) {
        if (!this.__accountsMap[address]) {
            return '';
        }
        return this.__accountsMap[address].status;
    }

    getTotalBalance() {
        return this.__totalBalance;
    }
}

module.exports = Account;