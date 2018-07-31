<template>
    <div class="account-head-wrapper">
        <div class="row">
            <span>{{ $t('accDetail.name') }}: </span>
            <span @click="startRename">{{ accountName }}</span>
            <input v-show="isShowNameInput" type="text" autofocus
                   v-model="editName" :placeholder="accountName"
                   @input="inputName"/>
        </div>
        <backup-account class="backup"></backup-account>
        <span class="test-token" @click="getTestToken">{{ $t('accDetail.getTestToken') }}</span>
        <a :href="'https://test.vite.net/account/' + address" target="_blank">
            {{ $t('accDetail.transDetail') }}
        </a>
    </div>
</template>

<script>
import backupAccount from 'components/backupAccount.vue';

export default {
    components: {
        backupAccount
    },
    data () {
        return {
            address: this.$route.params.address,
        };
    },
    methods: {
        getTestToken() {
            viteWallet.TestToken.get().then(({
                amount, tokenId
            })=>{
                console.log(amount, tokenId);
                window.alert(this.$t('accDetail.hint.token'));
            }).catch((err)=>{
                console.warn(err);
                window.alert('get test-token fail');
            });
        }
    }
};
</script>
<style lang="scss">
    .account-head-wrapper{
        width: 100%;
        height: 95px;
        line-height: 94px;
        margin: 0 34px;
        text-align: center;
        .backup{
            display: inline-block;
            float: right;
        }
        .test-token{
            display: inline-block;
            float: right;
        }
    }

</style>
