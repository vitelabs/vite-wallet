const account = require('./account.js');
const net = require('./net.js');
const block = require('./block.js');
const keystore = require('./keystore.js');
const system = require('./system.js');
const outeside = require('./outeside.js');

const Account = new account();
const Net = new net();
const Block = new block();
const Keystore = new keystore();
const System = new system();
const Outeside = new outeside();

module.exports = {
    Net, Account, Block, Keystore, System, Outeside
};
