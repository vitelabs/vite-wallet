module.exports = {
    hello: 'hello world',

    lang: 'English',
    nav: {
        home: 'Home',
        head: {
            title: 'Account',
            create: 'Create',
            imported: 'Import',
            backup: 'Back Up',
        },
        sync: 'Nodes Syncing',
        noNet: 'No network detected!',
        firstDone: 'Init Done',
        firstDoing: 'Initializing'
    },
    test:{
        t: 'Preview Version',
        txt1: 'Vite wallet is full node wallet in preview version, it achieves the functions of generating accounts in DAG ledger structure, searching balance, sending and receiving default transactions as well as getting test token.',
        txt2: 'Accounts are not supported importing private keys for now, please kindly keep your account files and passwords',
        v: 'Current version: Preview Version'
    },

    // account list
    accList: {
        balance: 'Balance',
    },

    //create account
    create: {
        input: 'Please input password',
        again: 'Please input password again!',
        choose:'Choose account',
        hint: {
            long: 'Your input must between 1-32 characters!',
            name: 'Account name is illegal',
            consistency: 'Please enter the same password!',
            save: 'Your private key stored in {0}，please keep it carefully，your account and password cannot be retrieved at current version!'
        }
    },
    dragDrop: {
        text: 'Drag and drop files there',
        err1: 'Imported illegal file!',
        err2: 'Only one file can be imported!',
    },

    // account detail
    accDetail: {
        title: 'Account Detail',
        transfer: 'Transfer',
        getTestToken: 'Get Test Tokens',
        transDetail: 'More transaction details',
        name: 'Account Name',
        address: 'My Address',
        balance: 'Balance',
        fundFloat: 'Fund in Float',
        pend: 'Pending',
        copy: 'Copy Account Address',
        outAddress: 'My Address',
        inAddress: 'Receive Address',
        sum: 'Amount',
        password: 'Password',
        hint: {
            token: 'You have got 100 test vite!',
            tErr: 'Get test token failed!',
            low: 'Insufficient account balance',
            wrong: 'Wrong Password!',
            amount: 'Amount must be greater than 0',
            punctuation: 'Punctuations are not allowed!',
            rename: 'Rename failed',
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
            confirms: 'Confirms',
            confirmed: 'Confirmed',
        },
        valid:{
            addr:'Address format error',
            bal:'Insufficient balance',
            pswd:'Password error',
            amt:'Amount format error',
            succ:'Transaction success!',
            err: 'Oops, error occurs'
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
        login: 'Login',
        imported: 'Import Account',
    },
    paging: {
        pre: 'Prev',
        next: 'Next',
        first: 'First',
        last: 'Last',
    },
    hint:{
        create: 'Creation failed',
        logoutErr: 'Logout Error!',
        pwErr: 'Password Error!',
    }
};
