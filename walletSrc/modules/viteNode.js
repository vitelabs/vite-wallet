const { spawn } = require('child_process');
const path = require('path');

let binPath = path.join(__dirname, '../scripts/server');

const proc = spawn(binPath);

proc.once('error', error => {
    console.log('error');
    console.log(error);
});

proc.stdout.on('data', data => {
    console.log('stdout');
    console.log(data.toString('utf8'));
});

proc.stderr.on('data', data => {
    console.log('stderr');
    console.log(data.toString('utf8'));
});