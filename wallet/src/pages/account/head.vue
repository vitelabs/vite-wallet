<template>
    <div class="account-head-wrapper">
        <div class="custom-name __ellipsis">
            <span v-show="!isShowNameInput">{{ accountName }}</span>
            <img v-show="!isShowNameInput" @click="startRename" class="edit" src="../../assets/imgs/edit_icon.svg"/>            
            <input v-show="isShowNameInput" type="text" autofocus
                   v-model="editName" :placeholder="accountName"
                   @input="inputName"/>
        </div>
        <div class="btn-group">
            <backup-account class="btn__small"></backup-account>
            <div class="btn__small __btn-test" @click="getTestToken">
                <span>{{ $t('accDetail.getTestToken') }}</span>
                <img src="../../assets/imgs/Vite_icon.svg" class="icon" />
            </div>
            <div class="btn__small __btn-detail">
                <a :href="'https://test.vite.net/account/' + address" target="_blank">
                    {{ $t('accDetail.transDetail') }}
                </a>
                <img src="../../assets/imgs/more_icon.svg" class="icon" />
            </div>
        </div>
    </div>
</template>

<script>
import backupAccount from 'components/backupAccount.vue';
let inputTimeout = null;

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
        getTestToken() {
            viteWallet.TestToken.get(this.address).then((data)=>{
                console.log(data);
                window.alert(this.$t('accDetail.hint.token'));
            }).catch((err) => {
                console.warn(err);
                window.alert('get test-token fail');
            });
        },

        startRename() {
            this.isShowNameInput = true;
        },
        clearInputTime() {
            window.clearTimeout(inputTimeout);
            inputTimeout = null;
        },
        inputName() {
            this.clearInputTime();
            inputTimeout = window.setTimeout(()=>{
                this.clearInputTime();
                this.rename(this.editName, () => {
                    this.isShowNameInput = false;
                });
            }, 500);
        }
    }
};
</script>

<style lang="scss">
@import "~assets/scss/vars.scss";

.account-head-wrapper {
    display: flex;
    margin: 0 6px;
    height: 84px;
    .custom-name {
        flex: 1;
        font-size: 24px;
        color: #272727;
        line-height: 84px;
        .edit {
            width: 20px;
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
        .btn__small {
            margin-left: 17px;
            padding: 4px 4px 4px 16px;
            background-color: $btn-color;
            border-radius: 24px;
            text-align: center;
            font-size: 14px;
            line-height: 24px;
            color: #fff;
            a {
                color: #fff;
            }
        }
        .icon {
            margin-bottom: -7px;
        }
    }
}
</style>
