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
export default {
    mounted() {
        this.fetchAccountList();
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
        fetchAccountList() {
            localAPI.getAccountList().then((data)=>{
                console.log(data);
                this.accountList = data;
            }).catch((err)=>{
                console.log(err);
            });
        }
    }
};
</script>
