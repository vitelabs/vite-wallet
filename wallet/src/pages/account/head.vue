<template>
    <div class="account-head-wrapper">
        <backup-account></backup-account>
        <span @click="getTestToken">{{ $t('accDetail.getTestToken') }}</span>
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

        }
    }
};
</script>
