<template>
    <div v-show="show" class="file-wrapper">
        <div ref="fileDrag" class="file-drag"></div>
        <span class="cancel">{{ $t('btn.cancel') }}</span>
    </div>
</template>

<script>
export default {
    props: {
        show: {
            type: Boolean,
            default: false
        }
    },
    mounted() {
        this.$refs.fileDrag.ondragstart = (event) => {
            console.log(event.dataTransfer.files);
            event.preventDefault();
            // ipcRenderer.send('ondragstart', '/path/to/item');
        };
    },
    methods: {
        valiadFile(filePath) {
            // to sync
            viteWallet.Account.isValidFile(filePath).then(()=>{
                if (!this.show) {
                    return;
                }
            }).catch(()=>{

            });
        }
    }
};
</script>

