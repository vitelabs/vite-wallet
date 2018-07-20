<template>
    <li>
        <span>{{ isFinish ? $t("nav.done") : $t("nav.sync") }}</span>
        <span>{{ blockPercent }}</span>
        <span v-show="!isFinish" @click="fetchSyncBlock">reload</span>
        <span v-show="isFinish">done</span>
    </li>
</template>

<script>
export default {
    data() {
        return {
            blockPercent: '0%',
            isFinish: false
        };
    },
    methods: {
        fetchSyncBlock() {
            viteWallet.Block.getSyncInfo().then((msg)=>{
                console.log(msg);
            }).catch((err)=>{
                console.log(err);
            });
        }
    }
};
</script>



