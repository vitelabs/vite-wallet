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
                 class="t-row __pointer" @click="goDetail(item)">
                <span class="cell-text">
                    <img v-show="item.type === 'send'" class="icon" src='../../assets/imgs/send.svg'/>
                    <img v-show="item.type === 'receive'" class="icon" src='../../assets/imgs/receive.svg'/>
                    {{ $t(`transList.tType.${item.type}`) }}
                </span>
                <span :class="{
                    'cell-text': true,
                    'pink': item.status !== 'confirmed',
                    'blue': item.status === 'confirmed'
                }">{{ item.status }}</span>
                <span class="cell-text">{{ item.date }}</span>
                <span class="cell-text">{{ item.transAddr }}</span>
                <span class="cell-text">{{ item.amount }}</span>
            </div>
        </div>

        <div class="no-data" v-show="!transList || !transList.length">
            no data
        </div>

        <pagination class="pagination" :currentPage="currentPage + 1" 
                    :totalPage="totalPage" :toPage="toPage"></pagination>
    </div>
</template>

<script>
import pagination from 'components/pagination.vue';
import date from 'utils/date.js';
import bigNumber from 'utils/bigNumber.js';

const pageCount = 6;
let reTimeout = null;
let eventChangeLang = null;
let lastFetchTime = null;

export default {
    components: {
        pagination
    },
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
            return bigNumber.dividedToNumber(this.totalNum, pageCount);
        },
        pageNumber() {
            return `${this.currentPage + 1}/${this.totalPage}`;
        }
    },
    destroyed() {
        this.clearReTimeout();
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
            let locale = this.$i18n.locale === 'zh' ? 'zh/' : '';
            window.open(`https://test.vite.net/${locale}transaction/${trans.hash}`);
        },

        toPage(pageNumber) {
            this.fetchTransList(pageNumber - 1);
        },

        clearReTimeout() {
            window.clearTimeout(reTimeout);
            reTimeout = null;
        },
        fetchTransList(pageIndex) {
            if ((pageIndex >= this.totalPage && pageIndex) || pageIndex < 0) {
                return;
            }

            let reFetch = () => {
                reTimeout = window.setTimeout(() => {
                    this.clearReTimeout();
                    this.fetchTransList(this.currentPage);
                }, viteWallet.Block.getLoopBlockTime());
            };

            let fetchTime = new Date().getTime();
            lastFetchTime = fetchTime;

            this.currentPage = pageIndex;
            viteWallet.Block.getTXList({
                address: this.address,
                pageIndex: this.currentPage,
                pageNum: pageCount
            }).then((list)=>{
                if (pageIndex !== this.currentPage || 
                    fetchTime !== lastFetchTime) {
                    return;
                }

                list = list || [];
                let nowList = [];

                list.forEach(item => {
                    let confirms = item.ConfirmedTimes;
                    let status = this.$t('transList.status.unconfirmed');
                    if (confirms && confirms <= 50) {
                        status = `this.$t('transList.status.confirms') (${confirms})`;
                    } else if (confirms && confirms > 50) {
                        status = this.$t('transList.status.confirmed');
                    }

                    let timestamp = item.Timestamp * 1000;
                    let amount = bigNumber.amountToBasicString(item.Amount);

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

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";

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
            height: 48px;
            line-height: 48px;
            font-family: $font-bold;
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
                font-family: $font-bold;
                color: #EA60AC;
            }
            .blue {
                font-family: $font-bold;
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
    }
}
</style>
