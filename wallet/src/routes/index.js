// [TODO] Dynamically generate routes by directory structure（don't need?）

import account from '../pages/account/index.vue';
import accountList from '../pages/accountList/index.vue';
import transaction from '../pages/transaction.vue';

export default [
    {
        name: 'accountList',
        path: '/',
        component: accountList
    },
    {
        name: 'account',
        path: '/account/:address',
        component: account
    },
    {
        name: 'transaction',
        path: '/transaction/:address',
        component: transaction
    }
];