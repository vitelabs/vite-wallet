<template>
    <div>
        <!-- [TODO] i18n -->
        <div>account balance: {{accountBalance}}</div>
        <div class="account-list">
            <div v-for="(item, index) in accountList" :key="index" @click="goAccount(item.address)">
                <div>{{item.name}}</div>
                <div>{{$t('accDetail.balance') + ': ' + item.balance}}</div>
                <div>{{item.address}}</div>
            </div>

            <div @click="goAccount('jsiodsdfsdfs')">sdsjdlsjd
            </div>

            <div class="btn-list">
                <span>{{ $t('paging.first') }}</span>
                <span>{{ $t('paging.pre') }}</span>
                <span>{{ currentPage + '/' + totalPage }}</span>
                <span>{{ $t('paging.next') }}</span>
                <span>{{ $t('paging.last') }}</span>
            </div>
        </div>

        <!-- <router-link :to="{ name: 'account', params: { id: 123 } }">{{ $t("hello") }}</router-link> -->
    </div>
</template>

<script>
import apis from 'utils/apis.js';

export default {
    mounted() {
        this.getAccountList();
    },
    data() {
        return {
            accountBalance: 0,
            accountList: [],
            currentPage: 0,
            totalPage: 0
        };
    },
    methods: {
        goAccount(address) {
            this.$router.push({
                name: 'account',
                params: { address }
            });
        },
        getAccountList() {
            // apis.getAccountList().then((data)=>{
            //     console.log(data);
            //     this.accountList = data;
            // }).catch((err)=>{
            //     console.log(err);
            // });
        }
    }
};
</script>
