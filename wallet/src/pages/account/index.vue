<template>
    <div class="account-wrapper">
        <account-head :accountName="accountName" :rename="rename"></account-head>

        <div class="account-detail">
            <div class="row">
                <div class="row-title">{{ $t('accDetail.balance') }}</div>

                <span class="__balance" v-show="!balanceInfos.length">0</span>
                <div v-show="balanceInfos.length" v-for="(balanceInfo, i) in balanceInfos" :key="i">
                    <span class="__balance">{{ balanceInfo.balance }}</span>
                    <span class="__symbol">{{ balanceInfo.tokenSymbol }}</span>
                </div>
            </div>
            <div class="row">
                <div class="row-title">
                    {{ $t('accDetail.fundFloat') }}
                    <span class="row-content">（{{ fundFloat.len || 0 }} wait for）</span>
                </div>

                <span v-show="!fundFloat.balanceInfos || !fundFloat.balanceInfos.length"
                      class="__balance" >0</span>
                <div v-for="(balanceInfo, i) in fundFloat.balanceInfos" :key="i">
                    <span class="__balance">{{ balanceInfo.balance }}</span>
                    <span class="__symbol">{{ balanceInfo.tokenSymbol }}</span>
                </div>
            </div>
            <div class="row address">
                <div class="row-title">
                    <span class="row-title__text">{{ $t('accDetail.address') }}</span>
                    <span @click="copy" class="row-title__copy __pointer">{{ $t('accDetail.copy') }}</span>
                </div>
                <div class="__btn_text">{{ address }}</div>
            </div>
        </div>

        <trans-list :totalNum="blockHeight" ></trans-list>
    </div>
</template>

<script>
import accountHead from './head.vue';
import transList from './transList.vue';
import bigNumber from 'utils/bigNumber.js';

let inputTimeout = null;

export default {
    components: {
        transList, accountHead
    },
    mounted() {
        this.fetchAccount();
    },
    data() {
        return {
            address: this.$route.params.address,
            accountName: '',
            balanceInfos: [],
            fundFloat: {},
            blockHeight: '0'
        };
    },
    destroyed() {
        window.clearTimeout(inputTimeout);
        inputTimeout = null;
    },
    methods: {
        copy() {
            viteWallet.System.clipboardWrite(this.address);
        },

        rename(name, cb) {
            let result = viteWallet.Account.rename(this.address, name);
            if (!result) {
                window.alert('fail');
                return;
            }
            this.accountName = name;
            cb && cb();
        },

        fetchAccount() {
            viteWallet.Account.get(this.address).then(({
                name, balanceInfos, fundFloat, blockHeight
            }) => {
                this.accountName = name;
                this.fundFloat = fundFloat;
                this.blockHeight = blockHeight;

                // deal with balanceinfo
                balanceInfos = balanceInfos || [];
                let balanceList = [];
                balanceInfos.forEach(({ Balance, TokenSymbol })=>{
                    console.log(Balance, TokenSymbol);
                    balanceList.push({
                        balance: bigNumber.amountToBasicString(Balance),
                        tokenSymbol: TokenSymbol
                    });
                });
                this.balanceInfos = balanceList;

                // deal with fundinfo
                let fundInfos = fundFloat.balanceInfos || [];
                let fundList = [];
                fundInfos.forEach(({ Balance, TokenSymbol })=>{
                    console.log(Balance, TokenSymbol);
                    fundList.push({
                        balance: bigNumber.amountToBasicString(Balance),
                        tokenSymbol: TokenSymbol
                    });
                });
                this.fundFloat.balanceInfos = fundList;
            }).catch((err) => {
                window.alert(err);
            });
        }
    }
};
</script>

<style lang="scss" rel="stylesheet/scss">
.account-wrapper{
    position: relative;
    box-sizing: border-box;
    padding: 0 30px 30px 30px;
    height: 100%;
    overflow: auto;
    .account-detail{
        display: flex;
        padding: 24.5px 22.5px 20.2px;
        background: #FFF;
        border: 1px solid #F6F5F5;
        box-shadow: 0 2px 15px 1px rgba(176,192,237,0.42);
        border-radius: 8px;
        .row {
            flex: 1;

            .__balance {
                font-size: 34px;
                color: #1D2024;
                line-height: 34px;
            }
            .__symbol {
                position: relative;
                top: -17px;
                margin-left: 15px;
                font-weight: bold;
                font-size: 14px;
                color: #3A3C43;
                line-height: 16px;
            }

            .row-title {
                display: inline-block;
                width: 100%;
                font-weight: bold;
                font-size: 14px;
                color: #1D2024;
                line-height: 16px;
                padding-bottom: 12px;
                .row-title__text{
                    float: left;
                }
                .row-title__copy{
                    float: right;
                    color: #4B74FF;
                }
            }
            .row-content {
                color: #8D9BAE;
            }
            .__btn_text {
                font-size: 12px;
                width: 100%;
                display: inline-block;
                box-sizing: border-box;
                background: #F3F6F9;
                border: 1px solid #D4DEE7;
                border-radius: 2px;
                height: 34px;
                line-height: 34px;
                padding: 0 8px;
                opacity: 0.3;
                color: #283D4A;
            }
        }
    }
}
</style>
