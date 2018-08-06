<template>
    <div class="__index_wrapper import-account-wrapper">
        <div class="msg" v-show="errMsg" >{{ errMsg }}</div>
        <div ref="fileArea" class="file-drag">{{ $t('dragDrop.text') }}</div>
        <router-link class="__btn_link" :to="{ name: 'login' }">{{ $t('btn.login') }}</router-link>
    </div>
</template>

<script>
export default {
    data() {
        return {
            files: [],
            errMsg: ''
        };
    },
    mounted() {
        document.addEventListener('drop', async (e) => {
            e.preventDefault();
            e.stopPropagation();

            if (e.target !== this.$refs.fileArea) {
                return;
            }

            if (e.dataTransfer.files.length > 1) {
                this.errMsg = this.$t('dragDrop.err2');
                return;
            }
            
            for (let f of e.dataTransfer.files) {
                try {
                    let data = await viteWallet.Keystore.importFile(f.path, f.name);
                    if (!data) {
                        this.errMsg = this.$t('dragDrop.err2');
                        return;
                    }
   
                    this.errMsg = '';
                    this.$router.push({
                        name: 'login',
                        params: {
                            address: data
                        }
                    });
                } catch(err) {
                    this.errMsg = err && err.message ? err.message : this.$t('dragDrop.err2');
                }
            }
        });

        document.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.stopPropagation();
        });
    }
};
</script>

<style lang="scss" scoped>
.__index_wrapper {
    position: relative;
    margin-top: 0;
}
.file-drag {
    height: 171px;
    background: #F3F6F9;
    border: 1px solid #D4DEE7;
    border-radius: 3px;
    line-height: 171px;
    text-align: center;
    opacity: 0.3;
    font-size: 16px;
    color: #283D4A;
}
.__btn_link {
    margin-top: 22.5px;
}
.msg {
    margin-bottom: 12px;
    font-size: 14px;
    line-height: 16px;
    color: #FF2929;
    text-align: center;
}
</style>

