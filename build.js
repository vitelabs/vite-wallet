const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const electronBuilder = require('electron-builder');

const appPath = path.join(__dirname, 'app/');
const nodeModulesPath = path.join(__dirname, 'node_modules');
const toModulePath = path.join(appPath, 'modules');
const except = ['walletPages'];

const no_build = process.env.NO_BUILD === 'true';
const build_win = process.env.p === 'WIN';

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
copyFolder('./wallet', path.join(appPath, 'walletPages'));
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

function copyIcon() {
    copyFolder(
        path.join(__dirname, '/walletSrc/icon'),
        path.join(appPath, '/icon')
    );
}

function writePackage() {
    let packageFile = require('./package.json');
    let version = require('./walletSrc/version.json');

    packageFile.main = 'main.js';
    if (version.buildType !== 'prod') {
        packageFile.version = version.version + '-' + version.clientCode++;
    } else {
        packageFile.version = version.version;
    }
    let build = require('./electron.build.json');
    packageFile.build = build;

    fs.writeFileSync('./walletSrc/version.json', JSON.stringify(version), 'utf8');
    fs.writeFileSync('./app/package.json', JSON.stringify(packageFile), 'utf8');
}

function startBuild() {
    let target = process.env.p === 'WIN' ? electronBuilder.Platform.WINDOWS : electronBuilder.Platform.MAC;
    electronBuilder.build({
        targets: electronBuilder.createTargets([
            target
        ], null, 'all'),
        projectDir: path.join(__dirname, './app'),
        publish: 'never'
    }).then((files)=>{
        writeSha256(files);
    }).catch(err => {
        throw new Error(err);
    });
}

function writeSha256(files) {
    let suffix = build_win ? '.exe' : '.dmg';
    if (!files || !files.length) {
        return;
    }

    let i;
    for (i=0; i<files.length; i++) {
        let file = files[i];
        if (file.endsWith(suffix)) {
            break;
        }
    }

    if (i >= files.length) {
        return;
    }

    exec(`shasum -a 256 "${files[i]}"`, (err, stdout)=>{
        if (err) {
            console.log(err);
            return;
        }

        let sha256 = stdout.split(' ')[0];
        try {
            let folder = `./build${build_win ? 'WIN' : 'MAC'}`;
            let arr = files[i].split('/');
            let fname = arr[arr.length - 1];
            !fs.existsSync(folder) && fs.mkdirSync(folder);
            fs.writeFileSync(`${folder}/sha256`, `${fname} : ${sha256}`, 'utf-8');
            fs.renameSync(files[i], `${folder}/${fname}`);
            
            console.log(`Build finished ${folder}: ${fname} - ${sha256}`);
        } catch(err) {
            console.log(err);
        }
    });
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