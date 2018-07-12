const electron = require('electron');

let ipcRenderer = electron.ipcRenderer;
ipcRenderer.on('getLocalSend', (event, message) => {
    console.log(message);
    window.$i18n.locale = message;
});
ipcRenderer.send('getLocal');

module.exports = {
    electron
};