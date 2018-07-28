<template>
    <div>
        <div class="title">{{ $t('accDetail.transfer') }}</div>

        <div class="content">
            <div class="row">
                <span>{{ $t('accDetail.outAddress') }}</span>
                <span>{{ outAddress }}</span>
            </div>
            <div class="row">
                <span>{{ $t('accDetail.balance') }}</span>
                <span v-show="!balanceInfos.length">0</span>
                <span v-show="balanceInfos.length" v-for="(balanceInfo, i) in balanceInfos" :key="i">
                    {{ balanceInfo.Balance + ' ' + balanceInfo.TokenSymbol }}
                </span>
            </div>
            <div class="row">
                <span>{{ $t('accDetail.inAddress') }}</span>
                <input v-model="inAddress" />
                <span v-show="isValidAddress" class="err">address illegal</span>
            </div>
            <div class="row">
                <span>{{ $t('accDetail.sum') }}</span>
                <input v-model="amount" />
                <span v-show="amountErr" class="err">{{ amountErr }}</span>
            </div>
            <div class="row">
                <span>{{ $t('accDetail.password') }}</span>
                <input v-model="password" type="password" />
                <span v-show="passwordErr" class="err">{{ passwordErr }}</span>
            </div>
        </div>

        <div class="btn" @click="transfer">{{ $t('accDetail.transfer') }}</div>
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
        outAddress: function() {
            clearTimeout(outAddrTimeout);
            outAddrTimeout = null;

            outAddrTimeout = setTimeout(async ()=> {
                outAddrTimeout = null;
                try {
                    this.isValidAddress = await viteWallet.Types.isValidAddress(this.outAddress);
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
                        address: this.address
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

