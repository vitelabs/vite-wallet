<template>
    <li>
        <span>{{ isFinish ? $t("nav.done") : $t("nav.sync") }}</span>
        <span>{{ blockPercent }}</span>
        <span v-show="!isFinish" @click="reloadBlock">reload</span>
        <span v-show="isFinish">done</span>
    </li>
</template>

<script>
export default {
    data() {
        return {
            currentHeight: '',
            startHeight: '',
            targetHeight: ''
        };
    },
    mounted() {
        this.getSyncBlock();
    },
    computed: {
        isFinish() {
            return this.blockPercent === '100%';
        },
        blockPercent() {
            if (!this.currentHeight || !this.startHeight || !this.targetHeight || 
                !(this.targetHeight - this.startHeight)) {
                return '---';
            }
            return (this.currentHeight - this.startHeight) / (this.targetHeight - this.startHeight) * 100 + '%';
        }
    },
    methods: {
        reloadBlock() {
            viteWallet.Block.getSyncInfo(false).then(({
                startHeight, targetHeight, currentHeight
            }) => {
                console.log('yes');
                this.startHeight = startHeight;
                this.targetHeight = targetHeight;
                this.currentHeight = currentHeight;
            }).catch((err)=>{
                console.warn(err);
            });
        },
        getSyncBlock() {
            let {
                startHeight, targetHeight, currentHeight
            } = viteWallet.Block.getSyncInfo();
            this.startHeight = startHeight;
            this.targetHeight = targetHeight;
            this.currentHeight = currentHeight;

            let loopTimeout = setTimeout(()=>{
                window.clearTimeout(loopTimeout);
                loopTimeout = null;
                this.getSyncBlock();
            }, 2000);
        }
    }
};
</script>



