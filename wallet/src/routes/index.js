// [TODO] Dynamically generate routes by directory structure

import account from '../pages/account.vue';
import accountList from '../pages/accountList.vue';
import transaction from '../pages/transaction.vue';

export default [
    {
        name: 'accountList',
        path: '/',
        component: accountList
    },
    {
        name: 'account',
        path: '/account/:id',
        component: account
    },
    {
        name: 'transaction',
        path: '/transaction',
        component: transaction
    }
];