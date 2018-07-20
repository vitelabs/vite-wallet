import Vue from 'vue';
import VueRouter from 'vue-router';
import VueI18n from 'vue-i18n';

import './mixins.scss';

import App from 'pages/index.vue';
import routes from 'routes/index';
import i18nConfig from 'i18n';

Vue.use(VueRouter);
Vue.use(VueI18n);

const i18n = new VueI18n(i18nConfig);
const router = new VueRouter({ routes });

const appReady = function(cb) {
    let loopTimeout = window.setInterval(()=>{
        if (!window.viteWallet) {
            return;
        }
        window.clearInterval(loopTimeout);
        loopTimeout = null;
        cb && cb();
    }, 30);
};

appReady(function () {
    const { System, Net } = viteWallet;

    let locale = System.getLocale();
    i18n.locale = locale === 'zh-CN' ? 'zh' : locale;

    const updateOnlineStatus = () => {
        Net.updateFromWeb(navigator.onLine);
    };
    window.addEventListener('online',  updateOnlineStatus);
    window.addEventListener('offline',  updateOnlineStatus);
    updateOnlineStatus();

    new Vue({
        el: '#app',
        components: { App },
        template: '<App/>',
        router,
        i18n
    });
});