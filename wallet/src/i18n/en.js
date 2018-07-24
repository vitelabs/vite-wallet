module.exports = {
    hello: 'hello world',

    lang: 'English',
    nav: {
        home: 'Home',
        head: {
            title: 'Account',
            create: 'Create Account',
            imported: 'Import Account',
            backup: 'Back Up Account',
        },
        sync: 'Nodes Syncing',
        done: 'Nodes Sync Completed'
    },

    // account list
    accList: {
        balance: 'Balance',
    },

    //create account
    create: {
        input: 'Please input password',
        again: 'Please input password again!',
        hint: {
            long: 'Your input must between 8-32 characters!',
            consistency: 'Please enter the same password!',
            save: 'Your private key stored in {0}，please keep it carefully，your account and password cannot be retrieved at current version!'
        }
    },
    dragDrop: {
        text: 'Drag and drop your account file into text area',
        errMsg: 'Cannot identify this file，upload failed!',
    },

    // account detail
    accDetail: {
        title: 'Account Detail',
        transfer: 'Transfer',
        getTestToken: 'Get Test Tokens',
        transDetail: 'See more account transaction details',
        name: 'Account Name',
        address: 'Account Address',
        balance: 'Balance',
        fundFloat: 'Fund in Float',
        copy: 'Copy Account Address',
        outAddress: 'Send Address',
        inAddress: 'Receive Address',
        sum: 'Amount',
        password: 'Password',
        hint: {
            token: 'You have got 100 test vite!',
            low: 'Insufficient account balance',
            wrong: 'Wrong Password!',
            amount: 'Amount must be greater than 0',
            punctuation: 'Punctuations are not allowed!',
        }
    },

    // Transaction List
    transList: {
        tType: {
            title: 'Transaction Type',
            send: 'Send',
            receive: 'Receive',
        },
        status: {
            title: 'Status',
            unconfirmed: 'Unconfirmed',
            confirmed: 'Confirmed',
        },
        timestamp: 'Timestamp',
        tAddress: 'Transaction side address',
        sum: 'Amount',
        tDetail: 'Transaction Detail',
    },

    //common
    btn: {
        create: 'Create',
        cancel: 'Cancel',
        login: 'Log In'
    },
    paging: {
        pre: 'Prev',
        next: 'Next',
        first: 'First',
        last: 'Last',
    },
};
