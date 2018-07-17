const { ipcMain } = require('electron');
const ipc = require('./ipc.js');

const pageAPIs = {
    'createAccount': 'NewAddress', 
    'getAccountList': 'ListAddress'
};

// [TODO] like openfile and so on
// const systemAPIs = {
// };

for (let key in pageAPIs) {
    ipcMain.on(key, (event, arg)=>{
        ipc[ pageAPIs[key] ](
            arg, 
            function(data) {
                event.sender.send(`${key}Back`, data);
            }
        );
    });
}
