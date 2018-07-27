const { readAccountNamesSync, writeAccountNames } = require('../utils/accountNames.js');
const ERRORS = require('../utils/errors.js');

const accNamePre = 'account';
const loopAddrListTime = 5000;
const loopBalanceListTime = 5000;

class Account {
    constructor() {
        // name / balance
        this.__accountsMap = {};
        this.__totalBalance = [];

        // init account names
        let names = readAccountNamesSync();
        this.__fileAccountsMap = names.namesMap || {};  // AccountName should be saved forever.
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
            // If no data, clear __accountsMap
            if (!data || !data.length) {
                this.__accountsMap = {};
                return;
            }

            let isChange = false;

            data.forEach(address => {
                // Already have name
                if (this.__accountsMap[address] && this.__accountsMap[address].name) {
                    return;
                }

                isChange = !this.__fileAccountsMap[address];
                let name = this.__fileAccountsMap[address] || `${accNamePre}${++this.__nameCount}`;
                this.__accountsMap[address] = this.__accountsMap[address] || {};    // Maybe other info already completed.
                this.__accountsMap[address].name = name;
                this.__fileAccountsMap[address] = name;
            });

            // Write name-file only when data changes
            isChange && writeAccountNames(this.__fileAccountsMap, this.__nameCount);

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
        let addrList = [];
        for (let address in this.__accountsMap) {
            addrList.push(address);
            proList.push(global.goViteIPC['ledger.GetAccountByAccAddr'](address));
        }

        if (!proList.length) {
            timeoutLoop();
            return;
        }

        Promise.all(proList).then((data)=>{
            let totalBalance = {};

            data.forEach(({ data }, i) => {
                let address = data ? data.Addr || addrList[i] : addrList[i];

                if (!this.__accountsMap[address]) {
                    return;
                }

                let balanceInfos = data && data.BalanceInfos ? data.BalanceInfos : [];
                this.__accountsMap[address].balanceInfos = balanceInfos;
                this.__accountsMap[address].blockHeight = data && data.BlockHeight ? data.BlockHeight : '';

                balanceInfos.forEach((balanceInfo) => {
                    let id = balanceInfo.TokenTypeId;

                    if (totalBalance[id]) {
                        // [TODO] bignumber
                        totalBalance[id].balance += balanceInfo.Balance;
                        return;
                    }

                    totalBalance[id] = {
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
            console.log(data);
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
        return global.goViteIPC['wallet.NewAddress'](pass);
    }

    get(address) {
        if (!this.__accountsMap[address]) {
            return Promise.reject( ERRORS.NO_DATA('account') );
        }

        return new Promise((res, rej)=>{
            global.goViteIPC['ledger.GetUnconfirmedInfo'](address).then(({
                data
            }) => {
                res({
                    name: this.__accountsMap[address].name || '',
                    balanceInfos: this.__accountsMap[address].balanceInfos || [],
                    fundFloat: {
                        balanceInfos: data && data.BalanceInfos ? data.BalanceInfos : [],
                        len: data ? data.UnConfirmedBlocksLen || '' : ''
                    }
                });
            }).catch((err)=>{
                rej(err);
            });
        });
    }

    rename(address, name) {
        if (!name || !this.__accountsMap[address]) {
            return false;
        }

        this.__accountsMap[address].name = name;
        this.__fileAccountsMap[address] = name;
        writeAccountNames(this.__fileAccountsMap, this.__nameCount);
        return true;
    }

    getList({ pageIndex, pageNum }) {
        let startInx = pageIndex * pageNum;
        let endInx = (pageIndex + 1) * pageNum;

        let count = 0;
        let proList = [];
        let addressList = [];

        for(let address in this.__accountsMap) {
            let c = count++;
            if (c >= endInx || c < startInx) {
                continue;
            }

            addressList.push(address);
            proList.push( global.goViteIPC['ledger.GetUnconfirmedInfo'](address) );
        }

        if (!proList.length) {
            return Promise.resolve({
                accountList: [],
                totalNum: count
            });
        }

        return Promise.all(proList).then((val) => {
            let accountList = [];
            val.forEach(({ data }, index)=>{
                let address = data ? data.Addr || addressList[index] : addressList[index];

                // This account already disappear.
                if (!this.__accountsMap[address]) {
                    return;
                }

                accountList.push({
                    address,
                    unconfBlock: data,
                    name: this.__accountsMap[address].name,
                    balanceInfos: this.__accountsMap[address].balanceInfos,
                    status: this.__accountsMap[address].status
                });
            });

            return {
                accountList,
                totalNum: count
            };
        });
    }

    unLock(address, pass) {
        return global.goViteIPC['wallet.UnLock']([address, pass, '0']);
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

    getBalance(address) {
        if (!this.__accountsMap[address]) {
            return Promise.reject(ERRORS.NO_DATA('address'));
        }
        return global.goViteIPC['ledger.GetAccountByAccAddr'](address);
    }
}

module.exports = Account;