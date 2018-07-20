const account = require('./account.js');
const net = require('./net.js');
const block = require('./block.js');
const keystore = require('./keystore.js');

const Account = new account();
const Net = new net();
const Block = new block();
const Keystore = new keystore();

module.exports = {
    Net, Account, Block, Keystore
};
