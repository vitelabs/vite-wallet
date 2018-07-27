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
                <span v-show="isValidAddress" class="err"></span>
            </div>
            <div class="row">
                <span>{{ $t('accDetail.sum') }}</span>
                <input v-model="amount" />
                <span class="err"></span>
            </div>
            <div class="row">
                <span>{{ $t('accDetail.password') }}</span>
                <input v-model="password" type="password" />
                <span class="err"></span>
            </div>
        </div>

        <div class="btn" @click="transfer">{{ $t('accDetail.transfer') }}</div>
    </div>
</template>

<script>
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
            balanceInfos: []
        };
    },
    computed: {
        isValidAddress() {
            // 
            return true;
        }
    },
    methods: {
        fetchAccount() {
            viteWallet.Account.get(this.outAddress).then(({
                balanceInfos
            }) => {
                this.balanceInfos = balanceInfos;
            }).catch((err) => {
                console.log(err);
                window.alert(err);
            });
        },
        transfer() {
            viteWallet.Block.createTX({
                selfAddr: this.outAddress, 
                toAddr: this.inAddress,
                pass: this.password,
                tokenId: 'tti_000000000000000000004cfd',
                amount: this.amount
            }).then(({
                balanceInfos
            }) => {
                window.alert('success');
                this.balanceInfos = balanceInfos;
            }).catch((err) => {
                window.alert(err);
            });
        }
    }
};
</script>

