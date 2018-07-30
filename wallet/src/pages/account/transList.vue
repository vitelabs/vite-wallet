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
                <span>{{ $t(`transList.status.${item.status}`) }}</span>
                <span>{{ item.date }}</span>
                <span>{{ item.transAddr }}</span>
                <span>{{ item.amount }}</span>
                <a :href="'https://test.vite.net/transaction/' + item.hash" target="_blank">{{ $t('transList.tDetail') }}</a>
            </div>
        </div>

        <div class="btn-list">
            <span @click="fetchTransList(0)">{{ $t('paging.first') }}</span>
            <span @click="fetchTransList(currentPage - 1)">{{ $t('paging.pre') }}</span>
            <span>{{ pageNumber }}</span>
            <span @click="fetchTransList(currentPage + 1)">{{ $t('paging.next') }}</span>
            <span @click="fetchTransList(totalPage - 1)">{{ $t('paging.last') }}</span>
        </div>
    </div>
</template>

<script>
import date from 'utils/date.js';
import BigNumber from 'bignumber.js';

const pageCount = 10;
let reTimeout = null;
let eventChangeLang = null;

export default {
    props: {
        totalNum: {
            type: String,
            default: '0'
        }
    },
    mounted() {
        this.fetchTransList(0);

        eventChangeLang = viteWallet.EventEmitter.on('changeLang', (locale)=>{
            this.updateTransListTime(locale);
        });
    },
    data() {
        return {
            address: this.$route.params.address, 
            transList: [],
            currentPage: 0
        };
    },
    computed: {
        totalPage() {
            let totalNum = new BigNumber(this.totalNum);
            return totalNum.dividedToIntegerBy(pageCount).integerValue();
        },
        pageNumber() {
            return `${this.currentPage + 1}/${this.totalPage}`;
        }
    },
    destroyed() {
        window.clearTimeout(reTimeout);
        reTimeout = null;
        viteWallet.EventEmitter.off(eventChangeLang);
    },
    methods: {
        updateTransListTime(locale) {
            let list = [];
            this.transList.forEach((oldTrans) => {
                let trans = Object.assign({}, oldTrans);
                trans.date = date(trans.timestamp, locale);
                list.push(trans);
            });
            this.transList = list;
        },

        fetchTransList(pageIndex) {
            if ( (pageIndex >= this.totalPage && pageIndex) || pageIndex < 0 ) {
                return;
            }

            let reFetch = ()=>{
                reTimeout = window.setTimeout(()=>{
                    window.clearTimeout(reTimeout);
                    reTimeout = null;
                    this.fetchTransList(this.currentPage);
                }, 5000);
            };

            this.currentPage = pageIndex;
            viteWallet.Block.getTXList({
                address: this.address,
                pageIndex: this.currentPage,
                pageNum: pageCount
            }).then((list)=>{
                // [TODO] request order
                if (pageIndex !== this.currentPage) {
                    return;
                }

                list = list || [];
                let nowList = [];

                list.forEach(item => {
                    let confirms = item.ConfirmedTimes;
                    console.log(confirms);
                    let status = 'unconfirmed';
                    if (confirms && confirms < 50) {
                        status = `confirms(${confirms})`;
                    } else if (confirms && confirms >= 50) {
                        status = 'confirmed';
                    }

                    let timestamp = item.Timestamp * 1000;

                    nowList.push({
                        type: item.FromAddr ? 'receive' : 'send',
                        status,
                        timestamp,
                        date: date(timestamp, this.$i18n.locale),
                        transAddr: item.FromAddr || item.ToAddr,
                        amount: item.FromAddr ? item.Amount : '-' + item.Amount,
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
