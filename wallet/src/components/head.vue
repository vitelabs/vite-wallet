<template>
    <header>
        <span>Vite Logo</span>
        <ul>
            <li>账户列表</li>
            <li>账户</li>
        </ul>
        <span>节点同步中</span>
    </header>
</template>

<script>
export default {
    mounted () {
        localAPI.createAccount(1).then((msg)=>{
            console.log(msg);
        }).catch((err)=>{
            console.log(err);
        });
    },
    methods: {

    }
};
</script>

<style lang="sass" scoped>

</style>
