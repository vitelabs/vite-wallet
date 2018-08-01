<template>
    <div class="account-head-wrapper">
        <div class="custom-name">
            <span>{{ $t('accDetail.name') }}: </span>
            <span @click="startRename">{{ accountName }}</span>
            <input v-show="isShowNameInput" type="text" autofocus
                   v-model="editName" :placeholder="accountName"
                   @input="inputName"/>
        </div>
        <div class="btn-group">
            <backup-account class="btn__small"></backup-account>
            <div class="btn__small __btn-test" @click="getTestToken">
                <span>{{ $t('accDetail.getTestToken') }}</span>
                <img src="../../assets/imgs/done_icon.svg" class="icon" />
            </div>
            <div class="btn__small __btn-detail">
                <a :href="'https://test.vite.net/account/' + address" target="_blank">
                    {{ $t('accDetail.transDetail') }}
                </a>
                <img src="../../assets/imgs/done_icon.svg" class="icon" />
            </div>
        </div>
    </div>
</template>

<script>
    import backupAccount from 'components/backupAccount.vue';

    export default {
        components: {
            backupAccount
        },
        data() {
            return {
                address: this.$route.params.address,
                accountName: '',
                isShowNameInput: false,
                editName: ''
            };
        },
        methods: {
            getTestToken() {
                viteWallet.TestToken.get().then(({
                                                     amount, tokenId
                                                 }) => {
                    console.log(amount, tokenId);
                    window.alert(this.$t('accDetail.hint.token'));
                }).catch((err) => {
                    console.warn(err);
                    window.alert('get test-token fail');
                });
            },
            inputName() {
                this.clearInputTime();

                inputTimeout = window.setTimeout(() => {
                    this.clearInputTime();
                    this.rename(this.editName);
                }, 500);
            },
            startRename() {
                this.isShowNameInput = true;
            },
        }
    };
</script>

<style lang="scss">
    @import "~assets/scss/vars.scss";

    .account-head-wrapper {
        display: flex;
        width: 100%;
        height: 100px;
        line-height: 100px;
        vertical-align: center;
        .custom-name {
            flex: 2;
            font-size: 20px;
            margin-left: 6px;
            color: #272727;
        }
        .btn-group {
            display: flex;
            align-items: center;
            flex: 1;
            .btn__small {
                width: fit-content;
                max-width: 184px;
                min-width: 100px;
                margin-left: 17px;
                height: 28px;
                line-height: 26px;
                background-color: $btn-color;
                border-radius: 24px;
                text-align: center;
                font-size: 14px;
                color: #fff;
            }
            .__btn-test {
                width: 125px;
                a {
                    color: #fff;
                }
            }
            .__btn-detail {
                width: 180px;
                a {
                    color: #fff;
                }
            }
            .icon {
                width: 9px;
                height: 11px;
                margin: 0 0 -2px 2px;
            }
        }
    }
</style>