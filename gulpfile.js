const path = require('path');
const gulp = require('gulp');
const babel = require('gulp-babel');
// const exec = require('child_process').exec;
// const del = require('del');

const BUILD_PATH = path.join(__dirname, 'app/');

let taskNames = [];

// gulp.task('buildWeb', function (cb) {
//     del(['./vite-web-wallet']).then(() => {
//         exec('git clone https://github.com/vitelabs/vite-web-wallet.git && \
//             cd vite-web-wallet && \
//             npm install && \
//             npm run build:app', (err, stdout, stderr) => {
//             console.log(stdout, stderr);
//             // del(['./vite-web-wallet']);
//             cb(err);
//         });
//     }).catch(err => {
//         cb(err);
//     });
// });
// taskNames.push('buildWeb');

let tasksConfig = [{
    name: 'walletSrc',
    startPath: 'walletSrc/**/*.js',
    buildPath: path.join(BUILD_PATH, '/walletSrc')
}, {
    name: 'utils',
    startPath: 'utils/**/*.js',
    buildPath: path.join(BUILD_PATH, '/utils')
}, {
    name: 'main',
    startPath: 'main.js',
    buildPath: BUILD_PATH
}];

tasksConfig.forEach((taskConf) => {
    taskNames.push(taskConf.name);

    gulp.task(taskConf.name, function () {
        return gulp.src(taskConf.startPath)
            .pipe(babel({
                presets: ['es2016-node5']
            }))
            .pipe(gulp.dest(taskConf.buildPath));
    });
});

gulp.task('srcJson', function () {
    return gulp.src('walletSrc/**/*.json')
        .pipe(gulp.dest(path.join(BUILD_PATH, '/walletSrc')));
});
taskNames.push('srcJson');

gulp.task('default', gulp.series(...taskNames, function(done) {
    done();
}));
