<template>
    <div class="account-list-wrapper">
        <div v-for="(account, i) in accountList" :key="i" @click="clickAccount(account)">
            <span>{{account.name}}</span>
            <span>{{account.address}}</span>
        </div>
        <router-link :to="{ name: 'createAccount' }">+++++++++ add account</router-link>
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
