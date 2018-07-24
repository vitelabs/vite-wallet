const spawn = require('child_process').spawn;
const fs = require('fs');
const path = require('path');
const binPath = path.join(process.cwd(), '/serverScript/server');

fs.chmodSync(binPath, 0o777);

module.exports = function(cb) {
    const subProcess = spawn(binPath);

    subProcess.once('error', error => {
        console.log('error', error);
    });
    
    subProcess.stdout.on('data', data => {
        if (data.toString().indexOf('Vite rpc start success!') < 0) {
            return;
        }
        console.log('start ipc Server');
        cb && cb();
    });
    
    subProcess.on('close', (code) => { 
        console.log(`quit code: ${code}`);
    });
};