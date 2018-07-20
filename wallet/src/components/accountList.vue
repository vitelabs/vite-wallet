<template>
    <div class="account-list">
        <div v-for="(item, index) in accountList" :key="index" @click="clickAccount(item.address)">
            <div>{{item.name}}</div>
            <div>{{$t('accDetail.balance') + ': ' + item.balance}}</div>
            <div>{{item.address}}</div>
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
const pageCount = 9;

export default {
    mounted() {
        this.getAccountList();
    },
    props: {
        clickAccount: {
            type: Function,
            default: ()=>{}
        }
    },
    data() {
        return {
            accountList: [],
            currentPage: 0,
            totalPage: 0
        };
    },
    methods: {
        getAccountList() {
            viteWallet.Account.getList({
                pageIndex: this.currentPage,
                pageNum: pageCount
            });
        }
    }
};
</script>
