<template>
    <div class="index-layout-wrapper">
        <div class="header">
            <img class="header-logo" src="../assets/imgs/testnet.svg" />
            <change-lang class="change-lang"></change-lang>
        </div>
        <div class="confirm-wrapper">
            <div class="confirm">
                <img class="top-background" src="../assets/imgs/bg2.svg"/>
                <img class="confirm-logo" src="../assets/imgs/ViteLogo.svg"/>
                <div class="confirm-content">
                    <slot></slot>
                </div>
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
    background: url('../assets/imgs/bg1.svg') rgba(255, 255, 255, 0.1) 100% no-repeat;
    background-size: 100%;
    background-position: 0 0;

    .header {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        padding: 4.9% 5.6%;
        .header-logo {
            display: inline-block;
            width: 70.5px;
        }
        .change-lang {
            display: inline-block;
            float: right;
        }
    }

    .confirm-wrapper {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        .confirm {
            background: #fff;
            position: relative;
            width: 375.5px;
            text-align: center;
            box-shadow: 0 2px 48px 1px rgba(29,17,86,0.12);
            border-radius: 8px;
            padding-bottom: 30px;
            .top-background {
                width: 100%;
                border-radius: 8px 8px 0 0;
            }
            .confirm-logo {
                position: absolute;
                top: 45px;
                left: 50%;
                margin-left: -82.5px;
                width: 165px;
                height: 96.75px;
            }
        }
    }
}
</style>
