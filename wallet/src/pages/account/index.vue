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
                    <span class="row-content">（{{ fundFloat.len || 0 }} {{$t('accDetail.pend')}})</span>
                </div>

                <span v-show="!fundFloat.balanceInfos || !fundFloat.balanceInfos.length"
                      class="__balance" >0</span>
                <div v-for="(balanceInfo, i) in fundFloat.balanceInfos" :key="i">
                    <span class="__balance">{{ balanceInfo.balance }}</span>
                    <span class="__symbol">{{ balanceInfo.tokenSymbol }}</span>
                </div>
            </div>
            <div class="row address">
                <div class="row-title __center">
                    <span class="row-title__text">{{ $t('accDetail.address') }}</span>
                    <span @click="copy" class="row-title__copy __pointer">{{ $t('accDetail.copy') }}</span>
                    <span class="copy-success" :class="{'show': copySuccess}">{{ $t('accDetail.hint.copy') }}</span>
                </div>
                <div class="__btn_text">{{ address }}</div>
            </div>
        </div>

        <div class="trans-list-wrapper">
            <trans-list :totalNum="blockHeight" ></trans-list>
        </div>
    </div>
</template>

<script>
import accountHead from './head.vue';
import transList from './transList.vue';
import bigNumber from 'utils/bigNumber.js';

let inputTimeout = null;
let fetchAccountTimeout = null;
let lastFetchTime = null;

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
            blockHeight: '0',
            copySuccess: false
        };
    },
    destroyed() {
        window.clearTimeout(inputTimeout);
        inputTimeout = null;
        this.clearAccountTimeout();
    },
    methods: {
        copy() {
            viteWallet.System.clipboardWrite(this.address);
            this.copySuccess = true;
            setTimeout(()=>{
                this.copySuccess = false;
            }, 500);
        },

        rename(name, cb) {
            let result = viteWallet.Account.rename(this.address, name);
            if (!result) {
                window.alert(this.$t('accDetail.hint.rename'));
                return;
            }
            this.accountName = name;
            cb && cb();
        },

        formatAmountList(balanceList) {
            balanceList = balanceList || [];
            let list = [];
            balanceList.forEach(({ Balance, TokenSymbol })=>{
                list.push({
                    balance: bigNumber.amountToBasicString(Balance),
                    tokenSymbol: TokenSymbol
                });
            });
            return list;
        },
        clearAccountTimeout() {
            window.clearTimeout(fetchAccountTimeout);
            fetchAccountTimeout = null;
        },
        fetchAccount() {
            let reFetch = () => {
                fetchAccountTimeout = window.setTimeout(()=>{
                    this.clearAccountTimeout();
                    this.fetchAccount();
                }, viteWallet.Block.getLoopBlockTime());
            };

            let nowFetchTime = new Date().getTime();
            lastFetchTime = nowFetchTime;

            viteWallet.Account.get(this.address).then(({
                name, balanceInfos, fundFloat, blockHeight
            }) => {
                if (lastFetchTime !== nowFetchTime) {
                    return;
                }

                this.accountName = name;
                this.fundFloat = fundFloat;
                this.blockHeight = blockHeight;
                this.balanceInfos = this.formatAmountList(balanceInfos);    // deal with balanceinfo
                this.fundFloat.balanceInfos = this.formatAmountList(fundFloat.balanceInfos);    // deal with fundinfo
                reFetch();
            }).catch((err) => {
                console.warn(err);
                window.alert(this.$t('transList.valid.err'));
                reFetch();
            });
        }
    }
};
</script>

<style lang="scss" rel="stylesheet/scss">
@import "~assets/scss/vars.scss";

.account-wrapper{
    position: relative;
    box-sizing: border-box;
    height: 100%;
    overflow: auto;
    display: flex;
    flex-direction: column;
    .account-detail{
        display: flex;
        margin: 0 30px;
        padding: 24.5px 22.5px 20.2px;
        background: #FFF;
        box-shadow: 0 2px 15px 1px rgba(176,192,237,0.17);
        border-radius: 8px;
        .row {
            flex: 1;
            margin-right: 20px;
            &:last-child {
                margin-right: 0;
            }
            .__balance {
                font-size: 26px;
                color: #1D2024;
                line-height: 34px;
                font-family: $font-H;
            }
            .__symbol {
                position: relative;
                top: -20px;
                font-size: 14px;
                color: #3A3C43;
                line-height: 16px;
                font-family: $font-H-bolder;
            }

            .row-title {
                position: relative;
                display: inline-block;
                width: 100%;
                font-size: 14px;
                color: #1D2024;
                line-height: 16px;
                padding-bottom: 24px;
                font-family: $font-bold;
                &.__center {
                    text-align: center;
                }
                .row-title__text{
                    float: left;
                }
                .row-title__copy{
                    float: right;
                    color: #4B74FF;
                }
                .copy-success {
                    transition: all 0.3s ease-in-out;
                    position: absolute;
                    bottom: 3px;
                    background: #5B638D;
                    box-sizing: border-box;
                    border: 1px solid #979797;
                    border-radius: 6px;
                    font-size: 12px;
                    line-height: 12px;
                    color: #FFFFFF;
                    padding: 6px;
                    opacity: 0;
                    font-family: $font-normal;
                    &.show {
                        opacity: 1;
                    }
                    &:after {
                        content: ' ';
                        display: inline-block;
                        border: 6px solid transparent;
                        border-top: 6px solid #5B638D;
                        position: absolute;
                        bottom: -12px;
                        left: 50%;
                        margin-left: -6px;
                    }
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
                line-height: 34px;
                padding: 0 8px;
                opacity: 0.3;
                color: #283D4A;
            }
        }
    }
    .trans-list-wrapper {
        flex: 1;
        overflow: auto;
        border-radius: 8px;
        padding: 30px;
    }
}
</style>
