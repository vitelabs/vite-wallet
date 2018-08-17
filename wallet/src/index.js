import Vue from 'vue';
import VueRouter from 'vue-router';
import VueI18n from 'vue-i18n';

import './assets/scss/mixins.scss';

import App from 'pages/index.vue';
import start from 'pages/start.vue';
import login from 'pages/login.vue';

import routes from 'routes/index';
import i18nConfig from 'i18n';
import EventEmitter from 'utils/eventEmitter.js';

Vue.use(VueRouter);
Vue.use(VueI18n);

const i18n = new VueI18n(i18nConfig);

const appReady = function(cb) {
    let allStop = function () {
        window.clearInterval(loopTimeout);
        loopTimeout = null;
        window.clearTimeout(stopTimeout);
        stopTimeout = null;
    };

    let loopTimeout = window.setInterval(()=>{
        if (!window.viteWallet) {
            return;
        }
        allStop();
        cb && cb();
    }, 30);

    let stopTimeout = window.setTimeout(()=>{
        allStop();
        cb && cb();
    }, 1000);
};

appReady(function () {
    // WALLET-WEB
    if (!window.viteWallet) {
        const router = new VueRouter({ routes });
        window.viteWallet = {
            System: {},
            Net: {},
            Account: {},
            Block: {},
            EventEmitter
        };
        new Vue({
            el: '#app',
            components: { App },
            template: '<App/>',
            router,
            i18n
        });
        return;
    }

    // WALLET-CLIENT
    viteWallet.EventEmitter = EventEmitter;
    
    // After init global vars
    require('utils/loopBlock.js');
    require('utils/loopNet.js');

    const { System, Net, Account } = viteWallet;

    let locale = System.getLocale();
    i18n.locale = locale === 'zh-CN' ? 'zh' : locale;

    const updateOnlineStatus = () => {
        Net.updateFromWeb(navigator.onLine);
        viteWallet.EventEmitter.emit('clientNetStatus', navigator.onLine);
    };
    window.addEventListener('online',  updateOnlineStatus);
    window.addEventListener('offline',  updateOnlineStatus);
    updateOnlineStatus();

    let rootRoute = {
        name: 'index',
        path: '/'
    };
    Account.getList().then((list) => {
        rootRoute.component = list && list.length ? login : start;
        routes.push(rootRoute);
        initVue(routes);
    }).catch((err)=>{
        console.warn(err);

        rootRoute.component = start;
        routes.push(rootRoute);
        initVue(routes);
    });
});

function initVue(routes) {
    const router = new VueRouter({ routes });
    new Vue({
        el: '#app',
        components: { App },
        template: '<App/>',
        router,
        i18n
    });
}
