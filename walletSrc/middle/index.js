const { ipcMain } = require('electron');
const accountAPI = require('./account.js');
const netAPI = require('./net.js');
const blockAPI = require('./block.js');

const Account = new accountAPI.Account();
const Net = new netAPI.Net();
const Block = new blockAPI.Block();
let caller = {
    Account, Net, Block
};

// [TODO] more perfect.
onAPIs('Account', accountAPI.APIs);
onAPIs('Net', netAPI.APIs);
onAPIs('Net', blockAPI.APIs);

function onAPIs(namespace, apis) {
    apis.forEach((func) => {
        let noticeName = `${namespace}.${func}`;
        ipcMain.on(noticeName, (event, arg)=>{
            caller[namespace][func](arg).then((res) => {
                event.sender.send(`${noticeName}Back`, res);
            }).catch((e) => {
                event.sender.send(`${noticeName}Back`, e);
            });
        });
    });
}
