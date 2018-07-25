<template>
    <div v-show="show" class="file-wrapper">
        <div ref="fileDrag" class="file-drag">
            <span v-show="!files.length">Drag File Here</span>
            <span v-show="files.length" 
                  v-for="(path, i) in files" :key="i">{{ path }}</span>
        </div>
        <span class="cancel" @click="toHide">{{ $t('btn.cancel') }}</span>
    </div>
</template>

<script>
export default {
    props: {
        show: {
            type: Boolean,
            default: false
        },
        toHide: {
            type: Function,
            default: ()=>{}
        }
    },
    data() {
        return {
            files: []
        };
    },
    mounted() {
        document.addEventListener('drop', async (e) => {
            e.preventDefault();
            e.stopPropagation();

            let isErr = false;
            for (let f of e.dataTransfer.files) {
                try {
                    let data = await viteWallet.Keystore.importFile(f.path, f.name);
                    if (!data) {
                        window.alert('fail');
                    }
                } catch(err) {
                    console.log(err);
                    isErr = true;
                    window.alert('fail');
                }
            }
            !isErr && this.toHide();
        });

        document.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.stopPropagation();
        });
    }
};
</script>

<style lang="sass" scoped>
.file-drag {
    min-width: 100px;
    min-height: 100px;
    border: 1px solid black;
}
</style>

