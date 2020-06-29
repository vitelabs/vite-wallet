require('dotenv').config();

const fs = require('fs');
const path = require('path');
const electronBuilder = require('electron-builder');

const appPath = path.join(__dirname, 'app/');
const nodeModulesPath = path.join(__dirname, 'node_modules');
const toModulePath = path.join(appPath, 'modules');
const except = ['walletPages', 'walletPages-test'];
const no_build = process.env.NO_BUILD === 'true';


const startBuild = async () => {
    traversing(appPath, (fPath, folderLevel, next) => { 
        let stats = fs.statSync(fPath);
    
        if (stats.isDirectory()) {
            next(fPath, folderLevel + '../');
            return;
        }
    
        if (stats.isFile()) {
            formatFile(fPath, folderLevel);
        }
    }, './');
    // no_build && copyFolder('./vite-web-wallet/dist', path.join(appPath, 'walletPages'));
    copyIcon();
    writePackage();
    if (!no_build) {
        let target = process.env.p === 'WIN' ? electronBuilder.Platform.WINDOWS : electronBuilder.Platform.MAC;
        electronBuilder.build({
            targets: electronBuilder.createTargets([
                target
            ], null, 'all'),
            projectDir: path.join(__dirname, './app'),
            publish: process.env.RELEASE === 'true' ? 'always' : 'never'
        }).catch(err => {
            throw new Error(err);
        });
    }
}

startBuild().catch(err => {
    console.error(err);
    process.exit(1);
});

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

function writePackage() {	
    let packageFile = require('./package.json');	

    packageFile.main = 'main.js';	
    let build = require('./electron.build.json');	
    packageFile.build = build;	
    fs.writeFileSync('./app/package.json', JSON.stringify(packageFile), 'utf8');	
}

function copyIcon() {
    copyFolder(
        path.join(__dirname, '/walletSrc/icon'),
        path.join(appPath, '/icon')
    );
}

// Base function
function traversing (startPath, cb, folderLevel) {
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

    readdirSync(startPath, folderLevel);
}

function copyFolder (currentPath, targetPath) {
    if ( !fs.existsSync(currentPath) ) {
        console.error(new Error(`${currentPath}     is not exist.`));
        return;
    }
    !fs.existsSync(targetPath) && fs.mkdirSync(targetPath);
    
    traversing(currentPath, (fPath, targetPath, next, val) => {
        let stats = fs.statSync(fPath);
        let toPath = path.join(targetPath, val);

        if (stats.isDirectory()) {
            !fs.existsSync(toPath) && fs.mkdirSync(toPath);
            next(fPath, toPath);
            return;
        }

        if (stats.isFile()) {
            let file = fs.readFileSync(fPath);
            fs.writeFileSync(toPath, file);
        }
    }, targetPath);
}