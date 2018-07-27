<template>
    <div class="account-head">
        <span>{{ $t('accDetail.title') }}</span>
        <span @click="goTransfer">{{ $t('accDetail.transfer') }}</span>
        <span @click="getTestToken">{{ $t('accDetail.getTestToken') }}</span>
        <a :href="'https://test.vite.net/account/' + address" target="_blank">{{ $t('accDetail.transDetail') }}</a>
    </div>
</template>

<script>
export default {
    props: {
        address: {
            type: String,
            default: ''
        }
    },
    methods: {
        goTransfer() {
            let {
                isFirstSyncDone
            } = viteWallet.Block.getSyncInfo();
            let netStatus = viteWallet.Net.getStatus();

            if (!isFirstSyncDone || !netStatus) {
                return;
            }

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
