<template>
    <div>
        <div class="title">{{ $t('accDetail.transfer') }}</div>
        <div class="content">
            <div class="row">
                <span>{{ $t('accDetail.outAddress') }}</span>
                <span>{{ outAddress }}</span>
            </div>
            <div class="row">
                <span>{{ $t('accDetail.inAddress') }}</span>
                <input v-model="inAddress" />
                <span class="err"></span>
            </div>
            <div class="row">
                <span>{{ $t('accDetail.sum') }}</span>
                <input v-model="sum" />
                <span class="err"></span>
            </div>
            <div class="row">
                <span>{{ $t('accDetail.password') }}</span>
                <input v-model="password" />
                <span class="err"></span>
            </div>
        </div>
        <div class="btn" @click="transfer">{{ $t('accDetail.transfer') }}</div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            outAddress: this.$route.params.address,
            inAddress: '',
            sum: '',
            password: ''
        };
    },
    methods: {
        transfer() {
            
        }
    }
};
</script>

