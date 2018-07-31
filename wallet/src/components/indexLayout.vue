<template>
    <div class="index-layout-wrapper">
        <div class="header">
            <span class="header-logo">TESTNET</span>
            <change-lang class="change-lang"></change-lang>
        </div>
        <div class="confirm-wrapper">
            <div class="confirm">
                <img src="../assets/ViteLogo.svg"/>
                <!-- <logo></logo> -->
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<script>
import changeLang from 'components/changeLang';
import logo from 'components/logo';

export default {
    components: {
        changeLang, logo
    }
};
</script>

<style lang="sass" scoped>
.index-layout-wrapper {
    width: 100%;
    height: 100%;
    background: url('../assets/bg1.svg') 100% no-repeat;
    background-size: 100%;

    .header {
        position: absolute;
        top: 0;
        padding: 4.9% 5.6%;
        .header-logo {
            float: left;
        }
        .change-lang {
            float: right;
        }
    }

    .confirm-wrapper {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        .confirm {
            width: 33.2%;
            background: url('../assets/bg2.svg') 100% no-repeat;
            background-size: 100%;
        }
    }
}
</style>
