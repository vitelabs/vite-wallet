const ipc = require('../walletSrc/modules/ipc.js');
const path = require('path');
const ipcAPIs = new ipc();

describe('wallet_IPC_APIs', function () {
    // it('NewAddress_success', function (done) {
    //     ipcAPIs.NewAddress('password1').then(()=>{
    //         done();
    //     }).catch((err)=>{
    //         done(err);
    //     });
    // });

    it('ListAddress', function (done) {
        ipcAPIs.ListAddress().then(()=>{
            done();
        }).catch((err)=>{
            done(err);
        });
    });

    it('Status', function (done) {
        ipcAPIs.Status().then(()=>{
            done();
        }).catch((err)=>{
            done(err);
        });
    });

    // Should ensure that address exists
    it('UnLock', function (done) {
        ipcAPIs.UnLock(['vite_0e80c68d0980c5caf9443369872aae926b8151f995701e44d4', '0', '0']).then(()=>{
            done();
        }).catch((err)=>{
            done(err);
        });
    });

    // Should ensure that address exists
    it('Lock', function (done) {
        ipcAPIs.Lock('vite_f8e946026c2bb05c71bc2a2b1f74210be8738083b96c9319a2').then(()=>{
            done();
        }).catch((err)=>{
            done(err);
        });
    });

    it('ReloadAndFixAddressFile', function (done) {
        ipcAPIs.ReloadAndFixAddressFile().then(()=>{
            done();
        }).catch((err)=>{
            done(err);
        });
    });

    it('IsMayValidKeystoreFile', function (done) {
        ipcAPIs.IsMayValidKeystoreFile(path.join(__dirname, './keyFiles/vite_true.json')).then(()=>{
            done();
        }).catch((err)=>{
            done(err);
        });
    });
});