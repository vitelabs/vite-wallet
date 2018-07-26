const path = require('path');
const gulp = require('gulp');
const babel = require('gulp-babel');

const BUILD_PATH = path.join(__dirname, 'app/');

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

let taskNames = [];

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

gulp.task('default', taskNames, function (done) {
    done();
});
