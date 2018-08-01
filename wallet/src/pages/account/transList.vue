<template>
    <div v-show="true" class="trans-list-wrapper">
        <div class="table">
            <div class="t-header">
                <div class="cell-text">{{ $t('transList.tType.title') }}</div>
                <div class="cell-text">{{ $t('transList.status.title') }}</div>
                <div class="cell-text">{{ $t('transList.timestamp') }}</div>
                <div class="cell-text">{{ $t('transList.tAddress') }}</div>
                <div class="cell-text">{{ $t('transList.sum') }}</div>
                <div class="cell-text">{{ $t('transList.tDetail') }}</div>
            </div>

            <div class="t-row" v-for="(item, index) in testList" :key="index">
                <div class="cell-text">{{ item.a }}</div>
                <div :class="{
                    'cell-text': true,
                    'pink': item.status === 'unconfirmed',
                    'blue': item.status !== 'unconfirmed'
                }">{{ item.status }}
                </div>
                <div class="cell-text">{{ item.c }}</div>
                <div class="cell-text">{{ item.d }}</div>
                <div class="cell-text">{{ item.e }}</div>
                <div class="cell-text"><a :href="'https://test.vite.net/transaction/' + item.f" target="_blank">{{
                    item.g}}</a></div>
            </div>
            <!--<div v-for="(item, index) in transList" :key="index">-->
            <!--<span>{{ $t(`transList.tType.${item.type}`) }}</span>-->
            <!--<span>{{ $t(`transList.status.${item.status}`) }}</span>-->
            <!--<span>{{ item.date }}</span>-->
            <!--<span>{{ item.transAddr }}</span>-->
            <!--<span>{{ item.amount }}</span>-->
            <!--<a :href="'https://test.vite.net/transaction/' + item.hash" target="_blank">{{ $t('transList.tDetail') }}</a>-->
            <!--</div>-->
        </div>
        <div class="pagination">
            <div class="page-box">
                <img src="../../assets/imgs/done_icon.svg" class="icon"/>
            </div>
            <div class="page-box">
                <img src="../../assets/imgs/done_icon.svg" class="icon"/>
            </div>

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
            // this.fetchTransList(0);

            // eventChangeLang = viteWallet.EventEmitter.on('changeLang', (locale)=>{
            //     this.updateTransListTime(locale);
            // });
        },
        data() {
            return {
                address: this.$route.params.address,
                transList: [],
                isConfirm: false,
                testList: [
                    {
                        a: 1,
                        status: 'unconfirmed',
                        c: 2,
                        d: 2,
                        e: 2,
                        f: 2,
                        g: 2,
                    },
                    {
                        a: 1,
                        status: 'unconfirmed',
                        c: 2,
                        d: 2,
                        e: 2,
                        f: 2,
                        g: 2,
                    },
                    {
                        a: 1,
                        status: 'confirmed',
                        c: 2,
                        d: 2,
                        e: 2,
                        f: 2,
                        g: 2,
                    },
                    {
                        a: 1,
                        status: 'confirmed',
                        c: 2,
                        d: 2,
                        e: 2,
                        f: 2,
                        g: 2,
                    },
                    {
                        a: 1,
                        status: 'unconfirmed',
                        c: 2,
                        d: 2,
                        e: 2,
                        f: 2,
                        g: 2,
                    },
                ],
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

                this.currentPage = pageIndex;
                viteWallet.Block.getTXList({
                    address: this.address,
                    pageIndex: this.currentPage,
                    pageNum: pageCount
                }).then((list) => {
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
            .t-header {
                display: table-row;
                color: #1D2024;
                .cell-text {
                    display: table-cell;
                    padding-top: 20px;
                    text-align: right;
                    line-height: 16px;
                    font-size: 14px;
                    letter-spacing: 0;
                }
            }
            .t-row {
                display: table-row;
                height: 64px;
                color: #5E6875;
                .pink {
                    color: #EA60AC;
                }
                .blue {
                    color: #195ADD;
                }
                .cell-text {
                    display: table-cell;
                    padding: 30px 0 0 30px;
                    border-bottom: 1px solid #f3f6f9;
                    text-align: right;
                    line-height: 16px;
                    font-size: 14px;
                    letter-spacing: 0;
                }
            }
        }
        .pagination{
            text-align: center;
        }
    }
</style>
