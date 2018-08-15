<template>
    <div class="start-wrapper">
        <router-link class="__btn __btn_all_in" :to="{
            name: 'createAccount',
            params: { from: 'start' }
        }">start</router-link>
        <div class="line"></div>
        <router-link class="__btn __btn_border" :to="{
            name: 'importAccount',
            params: { from: 'start' }
        }">import account</router-link>
    </div>
</template>

<style lang="scss" scoped>
.start-wrapper {
    margin-top: 15px;
    .line {
        margin: 15px 0;
        width: 100%;
        height: 2px;
        background: #E5EDF3;
    }
}
</style>
