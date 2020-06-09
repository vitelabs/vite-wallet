const exec = require('child_process').exec;
const shell = require('shelljs');

exec('cd vite-web-wallet && \
        yarn install && \
        yarn build',
(err, stdout, stderr) => {
    console.log(stdout, stderr);
    if (err) {
        throw err;
    }
}
);