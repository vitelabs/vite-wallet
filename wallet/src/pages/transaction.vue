<template>
    <div class="transaction-wrapper">
        <div class="title">{{ $t('accDetail.transfer') }}</div>

        <div class="content-wrapper">
            <div class="row">
                <div class="row-t">{{ $t('accDetail.balance') }}</div>
                <div class="balance" v-show="!balanceInfos.length">0</div>
                <div v-show="balanceInfos.length" v-for="(balanceInfo, i) in balanceInfos" :key="i">
                    <span class="balance">{{ balanceInfo.Balance }}</span>
                    <span class="symbol">{{ balanceInfo.TokenSymbol }}</span>
                </div>
            </div>
            <div class="row">
                <div class="row-t">{{ $t('accDetail.outAddress') }}</div>
                <div class="__btn_text out-address">{{ outAddress }}</div>
            </div>
            <div class="row">
                <div class="row-t">{{ $t('accDetail.inAddress') }}</div>
                <span class="__btn_text __input" :class="{ 'active': !!inAddress }">
                    <input v-model="inAddress" />
                </span>
                <span v-show="!isValidAddress" class="err">
                    <img class="icon" src="../assets/error_icon.svg"/>address illegal
                </span>
            </div>
            <div class="row">
                <div class="row-t">{{ $t('accDetail.sum') }}</div>
                <span class="__btn_text __input amount" :class="{ 'active': !!amount }">
                    <input v-model="amount" />VITE
                </span>
                <span v-show="amountErr" class="err">
                    <img class="icon" src="../assets/error_icon.svg"/>{{ amountErr }}
                </span>
            </div>
            <div class="row">
                <div class="row-t">{{ $t('accDetail.password') }}</div>
                <span class="__btn_text __input" :class="{ 'active': !!password }">
                    <input v-model="password" type="password" />
                </span>
                <span v-show="passwordErr" class="err">
                    <img class="icon" src="../assets/error_icon.svg"/>{{ passwordErr }}
                </span>
            </div>

            <div class="btn" @click="transfer">{{ $t('accDetail.transfer') }}</div>
        </div>
    </div>
</template>

<script>
import BigNumber from 'bignumber.js';

let outAddrTimeout = null;
let amountTimeout = null;

export default {
    mounted() {
        this.fetchAccount();
    },
    data() {
        return {
            outAddress: this.$route.params.address,
            inAddress: '',
            amount: '',
            password: '',
            balanceInfos: [],

            isValidAddress: true,
            amountErr: '',
            passwordErr: ''
        };
    },
    watch: {
        inAddress: function() {
            clearTimeout(outAddrTimeout);
            outAddrTimeout = null;

            outAddrTimeout = setTimeout(async ()=> {
                outAddrTimeout = null;
                
                if (!this.inAddress) {
                    this.isValidAddress = false;
                    return;
                }

                try {
                    this.isValidAddress = await viteWallet.Types.isValidAddress(this.inAddress);
                } catch(err) {
                    console.warn(err);
                    this.isValidAddress = false;
                }
            }, 500);
        },
        password: function() {
            this.passwordErr = '';
        },
        amount: function() {
            clearTimeout(amountTimeout);
            amountTimeout = null;

            amountTimeout = setTimeout(async ()=> {
                amountTimeout = null;
                let result = /(^([0-9]+)$)|(^([0-9]+[.][0-9]+)$)/g.test(this.amount);
 
                if (!result || this.amount === '0') {
                    this.amountErr = 'amount error';
                    return;
                }

                this.amountErr = '';
            }, 500);
        }
    },
    methods: {
        fetchAccount() {
            viteWallet.Account.get(this.outAddress).then(({
                balanceInfos
            }) => {
                this.balanceInfos = balanceInfos;
            }).catch((err) => {
                console.warn(err);
                window.alert(err);
            });
        },
        transfer() {
            if (!+this.amount) {
                return;
            }

            viteWallet.Block.createTX({
                selfAddr: this.outAddress, 
                toAddr: this.inAddress,
                pass: this.password,
                tokenId: 'tti_000000000000000000004cfd',    // [TODO] fixed viteToken
                amount: new BigNumber(this.amount).toString()
            }).then(() => {
                window.alert('success');

                this.$router.push({
                    name: 'account',
                    params: {
                        address: this.outAddress
                    }
                });
            }).catch((err) => {
                console.warn(err);

                if (err && err.code && err.code === 4001) {
                    this.passwordErr = err.message || 'password error';
                    return;
                }

                window.alert(err && err.message? err.message : 'error');
            });
        }
    }
};
</script>

<style lang="sass" scoped>
.transaction-wrapper {
    position: relative;
    box-sizing: border-box;
    padding: 92px 30px 30px 30px;
    height: 100%;
}
.content-wrapper {
    padding: 0 30px;
    height: 100%;
    background: #FFFFFF;
    border: 1px solid #F6F5F5;
    box-shadow: 0 2px 48px 1px rgba(176,192,237,0.42);
    border-radius: 8px;
    .row {
        padding-top: 20px;
        .err {
            font-size: 12px;
            color: #FF2929;
            line-height: 16px;
            .icon {
                width: 20px;
                height: 20px;
                margin: 0 5px -5px 10px;
            }
        }
    }
    .row-t {
        font-weight: bold;
        font-size: 14px;
        color: #1D2024;
        line-height: 16px;
        padding-bottom: 12px;
    }
    .balance {
        font-size: 48px;
        color: #1D2024;
        line-height: 48px;
    }
    .symbol {

    }
    .__btn_text {
        display: inline-block;
        box-sizing: border-box;
        background: #F3F6F9;
        border: 1px solid #D4DEE7;
        border-radius: 2px;
        height: 36px;
        line-height: 36px;
        padding: 0 15px;
        opacity: 0.3;
        color: #5E6875;
    }
    &.out-address {
        min-width: 300px;
    }
    .__input {
        width: 300px;
        input {
            background: #F3F6F9;
            font-size: 14px;
            width: 100%;
        }
        &.active {
            opacity: 1;
        }
        &.amount input {
            width: 220px;
            margin-right: 10px;
        }
    }
}
.title {
    position: absolute;
    top: 30px;
    left: 30px;
    font-size: 24px;
    color: #272727;
    line-height: 32px;
}
.btn {
    width: 300px;
    height: 36px;
    line-height: 36px;
    background: #195BDD;
    border-radius: 4px;
    text-align: center;
    font-size: 14px;
    color: #FFFFFF;
    margin-top: 30px;
}
</style>
