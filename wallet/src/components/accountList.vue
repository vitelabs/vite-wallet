<template>
    <div class="account-list-wrapper">
        <div class="list-wrapper">
            <div class="__btn_input_active" 
                 v-for="(account, i) in accountList" :key="i" 
                 @click="clickAccount(account)">
                <div class="name">{{account.name}}</div>
                <div class="address">{{account.address}}</div>
            </div>
        </div>

        <router-link class="add-acc" :to="{ name: 'createAccount' }">
            <img class="icon" src="../assets/add_icon.svg"/>add account
        </router-link>
    </div>
</template>

<script>
export default {
    props: {
        accountList: {
            type: Array,
            default: ()=>{
                return [];
            }
        },
        clickAccount: {
            type: Function,
            default: ()=>{}
        }
    }
};
</script>

<style lang="sass" scoped>
.account-list-wrapper {
    position: absolute;
    z-index: 100;
    width: 100%;
    .list-wrapper {
        max-height: 112px;
        overflow: auto;
    }
    .add-acc {
        display: block;
        box-sizing: border-box;
        padding: 0 20px;
        width: 100%;
        height: 50px;
        line-height: 50px;
        text-align: left;
        background: #fff;
        border: 1px solid #D4DEE7;
        border-top: none;
        .icon {
            width: 16px;
            height: 16px;
            margin-bottom: -3px;
            margin-right: 9px;
        }
    }
}

.__btn_input_active {
    padding: 7px 15px;
    border-top: none;
}
.__btn_input_active:hover {
    background: #232738;
}
</style>
