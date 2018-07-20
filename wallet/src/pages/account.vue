<template>
    <div class="account-wrapper">
        <div class="account-head">
            <span>{{ $t('accDetail.title') }}</span>
            <span @click="goTransfer">{{ $t('accDetail.transfer') }}</span>
            <span @click="getTestToken">{{ $t('accDetail.getTestToken') }}</span>
            <!-- [TODO] go to vite.net/transactionList/:accountAddress -->
            <a href="http://www.baidu.com" target="_blank">{{ $t('accDetail.transDetail') }}</a>
        </div>

        <div class="account-detail">
            <div v-for="(val, key) in accDetail" :key="key">
                <span>{{ $t(`accDetail.${key}`) }}: </span>
                <span>{{ val }}</span>
            </div>
        </div>

        <span @click="copy">{{ $t('accDetail.copy') }}</span>

        <div class="trans-list-wrapper">
            <div class="title">
                <span>{{ $t('transList.tType.title') }}</span>
                <span>{{ $t('transList.status.title') }}</span>
                <span>{{ $t('transList.timestamp') }}</span>
                <span>{{ $t('transList.tAddress') }}</span>
                <span>{{ $t('transList.sum') }}</span>
                <span>{{ $t('transList.tDetail') }}</span>
            </div>
            <div class="list">
                <div v-for="(item, index) in transList" :key="index">
                    <!-- [TODO] transDetail -->
                </div>
            </div>
            <div class="btn-list">
                <span>{{ $t('paging.first') }}</span>
                <span>{{ $t('paging.pre') }}</span>
                <span>{{ currentPage + '/' + totalPage }}</span>
                <span>{{ $t('paging.next') }}</span>
                <span>{{ $t('paging.last') }}</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    mounted() {
        this.fetchAccount();
        this.fetchTransList();
    },
    data() {
        return {
            address: this.$route.params.address,
            accDetail: {
                name: 'sdsdsd',
                address: 'sdsdsdsdsdsd',
                balance: 'sdsdsdsdsd',
                fundFloat: 'sdsdsdsdsdsd'
            },
            transList: [],
            currentPage: 0,
            totalPage: 0
        };
    },
    methods: {
        fetchAccount() {
            viteWallet.Account.get(this.address).then((data) => {
                console.log(data);
            }).catch((err) => {
                console.log(err);
            });
        },
        fetchTransList() {
            viteWallet.Block.getTXList({
                address: this.address,
                pageIndex: this.currentPage,
                pageNum: 10
            }).then(()=>{

            }).catch(()=>{

            });
        },

        copy() {

        },
        goTransfer() {
            this.$router.push({
                name: 'transaction',
                params: {
                    address: this.address
                }
            });
        },
        getTestToken() {

        }
    }
};
</script>

<style lang="scss" rel="stylesheet/scss">
</style>

