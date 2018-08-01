<template>
    <div class="account-wrapper">
        <account-head></account-head>

        <div class="account-detail">
            <div class="row">
                <div class="row-title">{{ $t('accDetail.balance') }}: </div>
                <div class="row-content" v-show="!balanceInfos.length">0</div>
                <span v-show="balanceInfos.length" v-for="(balanceInfo, i) in balanceInfos" :key="i">
                    {{ balanceInfo.Balance + ' ' + balanceInfo.TokenSymbol }}
                </span>
            </div>
            <div class="row">
                <div class="row-title">{{ $t('accDetail.fundFloat') }}: </div>
                <span v-for="(balanceInfo, i) in fundFloat.balanceInfos" :key="i">
                    {{ balanceInfo.Balance + ' ' + balanceInfo.TokenSymbol }}
                </span>
                <div class="row-content">{{ fundFloat.len || 0 }}</div>
            </div>
            <div class="row">
                <div class="row-title">
                    <span class="row-title__text">{{ $t('accDetail.address') }}: </span>
                    <span @click="copy" class="row-title__copy">{{ $t('accDetail.copy') }}</span>
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

let inputTimeout = null;

export default {
    components: {
        transList, accountHead
    },
    mounted() {
        // this.fetchAccount();
    },
    data() {
        return {
            address: this.$route.params.address,
            balanceInfos: [],
            fundFloat: {},
            blockHeight: '0',

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

        clearInputTime() {
            window.clearTimeout(inputTimeout);
            inputTimeout = null;
        },
        rename(name) {
            let result = viteWallet.Account.rename(this.address, name);
            if (!result) {
                window.alert('fail');
                return;
            }
            this.accountName = name;
            this.isShowNameInput = false;
        },

        fetchAccount() {
            viteWallet.Account.get(this.address).then(({
                name, balanceInfos, fundFloat, blockHeight
            }) => {
                this.accountName = name;
                this.balanceInfos = balanceInfos;
                this.fundFloat = fundFloat;
                this.blockHeight = blockHeight;
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
        .account-detail{
            display: flex;
            padding: 0 30px;
            height: 140px;
            background: #FFF;
            border: 1px solid #F6F5F5;
            box-shadow: 0 2px 15px 1px rgba(176,192,237,0.42);
            border-radius: 8px;
            .row {
                flex: 1;
                padding-top: 20px;
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
                    }
                }
                .row-content {
                    font-size: 48px;
                    color: #1D2024;
                    line-height: 48px;
                }
                .__btn_text {
                    width: 100%;
                    display: inline-block;
                    box-sizing: border-box;
                    background: #F3F6F9;
                    border: 1px solid #D4DEE7;
                    border-radius: 2px;
                    height: 48px;
                    line-height: 48px;
                    padding: 0 15px;
                    opacity: 0.3;
                    color: #283D4A;
                }
            }
        }
    }
</style>
