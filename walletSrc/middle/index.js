const account = require('./account.js');
const net = require('./net.js');
const block = require('./block.js');

const Account = new account();
const Net = new net();
const Block = new block();

module.exports = {
    Net, Account, Block
};
