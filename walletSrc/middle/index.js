const account = require('./account.js');
const net = require('./net.js');
const block = require('./block.js');
const keystore = require('./keystore.js');
const system = require('./system.js');
const types = require('./types.js');
const testToken = require('./testToken.js');

const Account = new account();
const Net = new net();
const Block = new block();
const Keystore = new keystore();
const System = new system();
const Types = new types();
const TestToken = new testToken();

global.walletIpcAPIs = {
    Net, Account, Block, Keystore, System, Types, TestToken
};
module.exports = global.walletIpcAPIs;
