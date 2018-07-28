<template>
    <div class="account-wrapper">
        <account-head></account-head>

        <div class="account-detail">
            <div class="row">
                <span>{{ $t('accDetail.name') }}: </span>
                <span @click="startRename">{{ accountName }}</span>
                <input v-show="isShowNameInput" type="text" autofocus
                       v-model="editName" :placeholder="accountName"
                       @input="inputName"/>
            </div>
            <div class="row">
                <span>{{ $t('accDetail.address') }}: </span>
                <span>{{ address }}</span>
                <span @click="copy">{{ $t('accDetail.copy') }}</span>
            </div>
            <div class="row">
                <span>{{ $t('accDetail.balance') }}: </span>
                <span v-show="!balanceInfos.length">0</span>
                <span v-show="balanceInfos.length" v-for="(balanceInfo, i) in balanceInfos" :key="i">
                    {{ balanceInfo.Balance + ' ' + balanceInfo.TokenSymbol }}
                </span>
            </div>
            <div class="row">
                <span>{{ $t('accDetail.fundFloat') }}: </span>
                <span v-for="(balanceInfo, i) in fundFloat.balanceInfos" :key="i">
                    {{ balanceInfo.Balance + ' ' + balanceInfo.TokenSymbol }}
                </span>
                <span>{{ fundFloat.len || 0 }}</span>
            </div>
        </div>

        <trans-list :address="address"></trans-list>
    </div>
</template>

<script>
import accountHead from './head.vue';
import transList from './transList.vue';

let inputTimeout = null;

export default {
    components: {
        transList, accountHead
    },
    mounted() {
        this.fetchAccount();
    },
    data() {
        return {
            address: this.$route.params.address,
            accountName: '',
            balanceInfos: [],
            fundFloat: {},

            isShowNameInput: false,
            editName: ''
        };
    },
    destroyed() {
        window.clearTimeout(inputTimeout);
        inputTimeout = null;
    },
    methods: {
        copy() {
            viteWallet.System.clipboardWrite(this.address);
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
                this.rename(this.editName);
            }, 500);
        },
        rename(name) {
            let result = viteWallet.Account.rename(this.address, name);
            if (!result) {
                window.alert('fail');
                return;
            }
            this.accountName = name;
            this.isShowNameInput = false;
        },

        fetchAccount() {
            viteWallet.Account.get(this.address).then(({
                name, balanceInfos, fundFloat
            }) => {
                this.accountName = name;
                this.balanceInfos = balanceInfos;
                this.fundFloat = fundFloat;
            }).catch((err) => {
                window.alert(err);
            });
        }
    }
};
</script>

<style lang="scss" rel="stylesheet/scss">
</style>
