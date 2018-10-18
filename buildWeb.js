const exec = require('child_process').exec;
// const del = require('del');

exec('git clone --depth 1 https://github.com/vitelabs/vite-web-wallet.git && \
        cd vite-web-wallet && \
        npm install && \
        npm run build',
(err, stdout, stderr) => {
    console.log(stdout, stderr);
    // del(['./vite-web-wallet']);
    // cb(err);
}
);