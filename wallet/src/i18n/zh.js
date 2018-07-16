module.exports = {
    hello: '你好 世界',
    lang: '中文',
    nav: {
        home: '首页',
        head: {
            title: '账户',
            create: '新建账户',
            imported: '导入账户',
            backup: '备份账户',
        },
        sync: '节点同步中',
        done: '节点同步完成'
    },

    // account list
    accList: {
        balance: '余额',
    },

    //create account
    create: {
        input: '请输入密码',
        again: '请再次输入密码',
        hint: {
            long: '密码需在8到32个字符之间',
            consistency: '请输入相同的密码',
            save: '您的私钥文件保存在 {0} 中，请谨慎保存，当前版本丢失密码账户不可找回'
        }
    },
    dragDrop: {
        text: '拖拽账户文件进入文本区域',
        errMsg: '文件无法识别，上传失败',
    },

    // account detail
    accDetail: {
        title: '账户详情',
        transfer: '转账',
        getTestToken: '获取测试用代币',
        transDetail: '查看账户更多交易详情',
        name: '账户名称',
        address: '账户地址',
        balance: '账户余额',
        fundFloat: '在途资金',
        copy: '复制账户地址',
        outAddress: '转出账户地址',
        inAddress: '接收账户地址',
        sum: '金额',
        password: '密码',
        hint: {
            token: '您获得了100测试代币',
            low: '账户余额不足',
            wrong: '密码错误',
            amount: '金额必须大于0',
            punctuation: '不可以出现标点符号',
        }
    },

    // Transaction List
    transList: {
        tType: {
            title: '交易类型',
            send: '发送',
            receive: '接收',
        },
        status: {
            title: '状态',
            unconfirmed: '待确认',
            confirmed: '已确认',
        },
        timestamp: '时间戳',
        tAddress: '交易方地址',
        sum: '金额',
        tDetail: '交易详情',
    },

    //common
    btn: {
        create: '创建',
        cancel: '取消',
    },
    paging: {
        pre: '上一页',
        next: '下一页',
        first: '首页',
        last: '末页',
    },
};
