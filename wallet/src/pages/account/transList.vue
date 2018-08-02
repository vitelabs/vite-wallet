<template>
    <div v-show="true" class="trans-list-wrapper">
        <div class="table">
            <div class="t-header">
                <div class="cell-text">{{ $t('transList.tType.title') }}</div>
                <div class="cell-text">{{ $t('transList.status.title') }}</div>
                <div class="cell-text">{{ $t('transList.timestamp') }}</div>
                <div class="cell-text">{{ $t('transList.tAddress') }}</div>
                <div class="cell-text">{{ $t('transList.sum') }}</div>
            </div>
            <div v-for="(item, index) in transList" :key="index"
                 class="t-row" @click="goDetail(item)">
                <span class="cell-text">
                    <img class="icon" :src="`../../assets/imgs/${item.type}.svg`"/>
                    {{ $t(`transList.tType.${item.type}`) }}
                </span>
                <span :class="{
                    'cell-text': true,
                    'pink': item.status === 'unconfirmed',
                    'blue': item.status !== 'unconfirmed'
                }">{{ item.status }}</span>
                <span class="cell-text">{{ item.date }}</span>
                <span class="cell-text">{{ item.transAddr }}</span>
                <span class="cell-text">{{ item.amount }}</span>
            </div>
        </div>

        <div class="no-data" v-show="!transList || !transList.length">
            no data
        </div>

        <!-- <div class="pagination"> -->
        <div v-show="!!+totalNum" class="pagination">
            <!-- E600 -->
            <span class="prev" @click="fetchTransList(currentPage - 1)"> &lt; </span>
            <span :class="{
                'active': currentPage === 0
            }" @click="fetchTransList(0)">1</span>
            <span v-show="totalPage - 1 > 1">{{ pageNumber }}</span>
            <!-- <span v-show="totalPage > 4">...</span> -->
            <span :class="{
                'active': currentPage === totalPage - 1
            }" v-show="totalPage - 1 > 1" @click="fetchTransList(totalPage - 1)">{{ +totalPage }}</span>
            <span @click="fetchTransList(currentPage + 1)"> &gt; </span>
        </div>
    </div>
</template>

<script>
import date from 'utils/date.js';
import BigNumber from 'bignumber.js';

const MIN_UNIT = new BigNumber('1000000000000000000');
const pageCount = 6;
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
            isConfirm: false,
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

        goDetail(trans) {
            window.open('https://test.vite.net/transaction/' + trans.hash);
        },

        fetchTransList(pageIndex) {
            if ((pageIndex >= this.totalPage && pageIndex) || pageIndex < 0) {
                return;
            }

            let reFetch = () => {
                reTimeout = window.setTimeout(() => {
                    window.clearTimeout(reTimeout);
                    reTimeout = null;
                    this.fetchTransList(this.currentPage);
                }, 5000);
            };

            console.log('fetch List');
            this.currentPage = pageIndex;
            viteWallet.Block.getTXList({
                address: this.address,
                pageIndex: this.currentPage,
                pageNum: pageCount
            }).then((list)=>{
                console.log(list);
                // [TODO] request order
                if (pageIndex !== this.currentPage) {
                    console.log('removeList');
                    return;
                }

                list = list || [];
                let nowList = [];

                list.forEach(item => {
                    let confirms = item.ConfirmedTimes;
                    let status = 'unconfirmed';
                    if (confirms && confirms <= 50) {
                        status = `confirms(${confirms})`;
                    } else if (confirms && confirms > 50) {
                        status = 'confirmed';
                    }

                    let timestamp = item.Timestamp * 1000;
                    let amount = new BigNumber(item.Amount).dividedBy(MIN_UNIT);

                    nowList.push({
                        type: item.FromAddr ? 'receive' : 'send',
                        status,
                        timestamp,
                        date: date(timestamp, this.$i18n.locale),
                        transAddr: item.FromAddr || item.ToAddr,
                        amount: item.FromAddr ? amount : '-' + amount,
                        hash: item.Hash
                    });
                });
                this.transList = nowList;

                reFetch();
            }).catch((err) => {
                console.warn(err);
                reFetch();
            });
        }
    }
};
</script>

<style lang="scss">
.trans-list-wrapper {
    position: relative;
    box-sizing: border-box;
    margin-top: 30px;
    background: #FFF;
    border: 1px solid #F6F5F5;
    box-shadow: 0 2px 15px 1px rgba(176, 192, 237, 0.42);
    border-radius: 8px;
    .table{
        display: table;
        width: 100%;
        .cell-text {
            display: table-cell;
            text-align: left;
            font-size: 14px;
            &:first-child {
                padding-left: 22.5px;
            }
            &:last-child {
                padding-right: 22.5px;
            }
        }
        .t-header {
            display: table-row;
            color: #1D2024;
            font-weight: bold;
            height: 48px;
            line-height: 48px;
        }
        .t-row {
            display: table-row;
            color: #5E6875;
            height: 48px;
            line-height: 48px;
            &:hover {
                box-shadow: 0 0px 1px 1px rgba(176, 192, 237, 0.1);
                background: rgba(176, 192, 237, 0.4);
            }
            .pink {
                color: #EA60AC;
            }
            .blue {
                color: #195ADD;
            }
            .cell-text {
                border-bottom: 1px solid #f3f6f9;
                .icon {
                    margin-right: 6px;
                    margin-bottom: -2px;
                }
            }
        }
    }
    .no-data {
        height: 48px;
        line-height: 48px;
        text-align: center;
    }
    .pagination {
        height: 75px;
        line-height: 75px;
        text-align: center;
        span {
            display: inline-block;
            width: 24px;
            height: 24px;
            border: 1px solid #C6CBD4;
            border-radius: 2px;
            line-height: 24px;
            font-size: 14px;
            color: #333;
            &.active {
                background: #195BDD;
                color: #fff;
            }
        }
    }
}
</style>
