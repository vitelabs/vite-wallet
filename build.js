const fs = require('fs');
const path = require('path');
const electronBuilder = require('electron-builder');

const appPath = path.join(__dirname, 'app/');
const nodeModulesPath = path.join(__dirname, 'node_modules');
const toModulePath = path.join(appPath, 'modules');
const except = ['walletPages'];
const no_build = process.env.NO_BUILD === 'true';

traversing(appPath, (fPath, folderLevel, next) => { 
    let stats = fs.statSync(fPath);

    if (stats.isDirectory()) {
        next(fPath, folderLevel + '../');
        return;
    }

    if (stats.isFile()) {
        formatFile(fPath, folderLevel);
    }
});
copyServer();
!no_build && copyIcon();
!no_build && writePackage();
!no_build && startBuild();

function formatFile(filePath, folderLevel) {
    let result = fs.existsSync(filePath);
    // Not exists
    if (!result) {
        console.error(new Error(`${filePath}     is not exists.`));
        return ;
    }

    let file = fs.readFileSync(filePath, {
        encoding: 'utf8'
    });

    if (!file.match(/(~app)/)) {
        return;
    }

    let modules = file.match(/(\'~app\/modules\/\S+\')/g);
    !fs.existsSync(toModulePath) && fs.mkdirSync(toModulePath);
    if (modules && modules.length) {
        modules.forEach((mPath) => {
            let module = mPath.split('\'~app\/modules\/')[1].replace(/\'/, '');
            copyFolder(
                path.join(nodeModulesPath, module),
                path.join(toModulePath, module)
            );
        });
    }

    fs.writeFileSync(filePath, file.replace(/(~app\/)/g, folderLevel), 'utf8');
}

function copyServer() {
    fs.writeFileSync('./app/viteGoServer', fs.readFileSync('./viteGoServer'));
}

function copyIcon() {
    copyFolder(
        path.join(__dirname, '/walletSrc/icon'),
        path.join(appPath, '/icon')
    );
}

function writePackage() {
    let packageFile = require('./package.json');
    packageFile.main = 'main.js';   
    let build = require('./electron.build.json');
    packageFile.build = build;
    fs.writeFileSync('./app/package.json', JSON.stringify(packageFile), 'utf8');
}

function startBuild() {
    electronBuilder.build({
        targets: electronBuilder.createTargets([
            electronBuilder.Platform.MAC
        ], null, 'all'),
        projectDir: path.join(__dirname, './app'),
        publish: 'never'
    }).catch(err => {
        throw new Error(err);
    });
}


// Base function

function traversing (startPath, cb) {
    function readdirSync (startPath, folderLevel) {
        let files = fs.readdirSync(startPath);

        files.forEach((val) => {
            if (except.indexOf(val) !== -1) {
                return;
            }

            let fPath = path.join(startPath, val);
            cb && cb(fPath, folderLevel, readdirSync, val);
        });

    }

    readdirSync(startPath, './');
}

function copyFolder (currentPath, targetPath) {
    if ( !fs.existsSync(currentPath) ) {
        console.error(new Error(`${currentPath}     is not exist.`));
        return;
    }
    !fs.existsSync(targetPath) && fs.mkdirSync(targetPath);
    
    traversing(currentPath, (fPath, folderLevel, next, val) => {
        let stats = fs.statSync(fPath);

        if (stats.isDirectory()) {
            !fs.existsSync(fPath) && fs.mkdirSync(fPath);
            next(fPath, folderLevel + '../');
            return;
        }

        if (stats.isFile()) {
            let file = fs.readFileSync(fPath);
            let toPath = path.join(targetPath, val);
            fs.writeFileSync(toPath, file);
        }
    });
}