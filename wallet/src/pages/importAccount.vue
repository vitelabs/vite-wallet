<template>
    <div class="import-account-wrapper">
        <div class="file-drag">
            <span v-show="!files.length">Drag File Here</span>
            <span v-show="files.length" 
                  v-for="(path, i) in files" :key="i">{{ path }}</span>
        </div>
        <div v-show="msg.type === 'error'">{{ msg.msg }}</div>
        <div v-show="msg.type === 'success'">{{ msg.msg }}</div>
        <router-link :to="{ name: 'login' }">login</router-link>
    </div>
</template>

<script>
export default {
    data() {
        return {
            files: [],
            msg: {},
            errMsg: '',
            successMsg: ''
        };
    },
    mounted() {
        document.addEventListener('drop', async (e) => {
            e.preventDefault();
            e.stopPropagation();

            if (e.dataTransfer.files.length > 1) {
                this.msg = {
                    type: 'error',
                    msg: 'only 1'
                };
                return;
            }
            
            for (let f of e.dataTransfer.files) {
                try {
                    let data = await viteWallet.Keystore.importFile(f.path, f.name);
                    if (!data) {
                        this.msg = {
                            type: 'error',
                            msg: 'file is illegal'
                        };
                        return;
                    }
   
                    this.msg = {
                        type: 'success',
                        msg: 'import success'
                    };
                    this.$router.push({
                        name: 'login',
                        params: {
                            address: data
                        }
                    });
                } catch(err) {
                    this.errMsg = err && err.message ? err.message : 'file is illegal';
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

<style lang="sass" scoped>
.file-drag {
    min-width: 100px;
    min-height: 100px;
    border: 1px solid black;
}
</style>

