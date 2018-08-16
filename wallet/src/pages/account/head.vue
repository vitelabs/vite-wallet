<template>
    <div class="account-head-wrapper">
        <div class="custom-name">
            <span class="name __ellipsis" @click="startRename" v-show="!isShowNameInput">{{ accountName }}</span>
            <img v-show="!isShowNameInput" @click="startRename" 
                 class="edit __pointer" src="../../assets/imgs/edit_icon.svg"/>            
            <input ref="nameInput" v-show="isShowNameInput" type="text" autofocus
                   v-model="editName" :placeholder="accountName"
                   @blur="_rename"/>
        </div>
        <div class="btn-group">
            <backup-account class="btn__small __pointer"></backup-account>
            <div class="btn__small __pointer __btn-test" @click="getTestToken">
                <span>{{ $t('accDetail.getTestToken') }}</span>
                <img src="../../assets/imgs/Vite_icon.svg" class="icon" />
            </div>
            <div @click="goDetail" class="btn__small __pointer __btn-detail">
                {{ $t('accDetail.transDetail') }}
                <img src="../../assets/imgs/more_icon.svg" class="icon" />
            </div>
        </div>
    </div>
</template>

<script>
import backupAccount from 'components/backupAccount.vue';
import Vue from 'vue';

export default {
    components: {
        backupAccount
    },
    props: {
        accountName: {
            type: String,
            default: ''
        },
        rename: {
            type: Function,
            default: () =>{}
        }
    },
    data() {
        return {
            address: this.$route.params.address,
            isShowNameInput: false,
            editName: ''
        };
    },
    methods: {
        goDetail() {
            let locale = this.$i18n.locale === 'zh' ? 'zh/' : '';
            window.open(`https://test.vite.net/${locale}account/${this.address}`);
        },

        getTestToken() {
            viteWallet.TestToken.get(this.address).then((data)=>{
                window.alert(this.$t('accDetail.hint.token'));
            }).catch((err) => {
                console.warn(err);
                window.alert(this.$t('accDetail.hint.tErr'));
            });
        },

        clearEditName() {
            this.isShowNameInput = false;
            this.editName = '';
            window.document.onkeydown = null;
        },
        startRename() {
            this.isShowNameInput = true;
            Vue.nextTick(()=>{
                window.document.onkeydown = (e) => {
                    e = e || window.event;
                    let code = e.keyCode || e.which;
                    if (!code || code !== 13) {
                        return;
                    }
                    this._rename();
                };
                this.$refs.nameInput.focus();
            });
        },
        _rename() {
            if (!this.editName) {
                this.clearEditName();
                return;
            }

            if ( !/^[a-zA-Z0-9_\u4e00-\u9fa5]+$/g.test(this.editName) ) {
                window.alert(this.$t('create.hint.name'));
                this.clearEditName();
                return;
            }

            if (this.editName.length > 32) {
                window.alert(this.$t('create.hint.nameLong'));
                this.clearEditName();
                return;
            }

            this.rename(this.editName, this.clearEditName);
        }
    }
};
</script>

<style lang="scss">
@import "~assets/scss/vars.scss";

.account-head-wrapper {
    display: flex;
    margin: 0 36px;
    height: 84px;
    .custom-name {
        flex: 1;
        font-size: 24px;
        color: #272727;
        line-height: 84px;
        .name {
            display: inline-block;
            max-width: 400px;
        }
        .edit {
            width: 20px;
            margin-bottom: 35px;
        }
        input {
            height: 32px;
            line-height: 32px;
            font-size: 20px;
            min-width: 200px;
            text-indent: 10px;
        }
    }
    .btn-group {
        display: flex;
        align-items: center;
        font-family: $font-normal-b;
        .btn__small {
            margin-left: 17px;
            padding: 4px 4px 4px 16px;
            background-color: $btn-color;
            border-radius: 24px;
            text-align: center;
            font-size: 14px;
            line-height: 24px;
            color: #fff;
        }
        .icon {
            margin-bottom: -7px;
        }
    }
}
</style>
