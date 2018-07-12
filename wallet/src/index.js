import Vue from 'vue';
import VueRouter from 'vue-router';
import VueI18n from 'vue-i18n';

import App from './pages/index.vue';
import routes from './routes/index';
import i18nConfig from './i18n';

Vue.use(VueRouter);
Vue.use(VueI18n);

const i18n = new VueI18n(i18nConfig);
const router = new VueRouter({
    routes
});

let vueInstance = new Vue({
    el: '#app',
    components: { App },
    template: '<App/>',
    router,
    i18n
});

window.$i18n = vueInstance.$i18n;