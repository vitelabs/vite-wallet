<template>
    <div v-show="transList.length" class="trans-list-wrapper">
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
                <span>{{ $t(`transList.tType.${item.type}`) }}</span>
                <span>{{ item.status }}</span>
                <span>{{ item.timestamp }}</span>
                <span>{{ item.fromAddr || item.toAddr }}</span>
                <span>{{ item.amount }}</span>
                <a :href="'www.baidu.com' + item.hash" target="_blank">{{ $t('transList.tDetail') }}</a>
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
</template>

<script>
let reTimeout = null;

export default {
    props: {
        address: {
            type: String,
            default: ''
        }
    },
    mounted() {
        this.fetchTransList();
    },
    data() {
        return {
            transList: [],
            currentPage: 0,
            totalPage: 0
        };
    },
    destroyed() {
        window.clearTimeout(reTimeout);
        reTimeout = null;
    },
    methods: {
        fetchTransList() {
            let reFetch = ()=>{
                reTimeout = window.setTimeout(()=>{
                    window.clearTimeout(reTimeout);
                    reTimeout = null;
                    this.fetchTransList();
                }, 5000);
            };

            viteWallet.Block.getTXList({
                address: this.address,
                pageIndex: this.currentPage,
                pageNum: 10
            }).then((list)=>{
                list = list || [];
                let nowList = [];

                list.forEach(item => {
                    let status = ['---', 'unconfirmed', 'confirmed'][item.Status];
                    if (status !== '---') {
                        status = this.$t(`transList.status.${status}`);
                    }
                    console.log(item);
                    nowList.push({
                        type: item.FromAddr ? 'send' : 'receive',
                        status,
                        timestamp: new Date(item.Timestamp),
                        fromAddr: item.FromAddr,
                        toAddr: item.ToAddr,
                        amount: item.FromAddr ? '-' + item.Amount : item.Amount,
                        hash: item.Hash
                    });
                });
                this.transList = nowList;

                reFetch();
            }).catch((err)=>{
                console.warn(err);
                reFetch();
            });
        }
    }
};
</script>
