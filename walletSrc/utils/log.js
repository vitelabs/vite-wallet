const isWindows = require('~app/modules/is-windows')();
const { app } = require('electron');
const os = require('os');
const fs = require('fs');
const path = require('path');

const LOG_DATE_PATH = path.join(global.LOG_PATH, 'log_date');   // save LogTime
const validityPeriod = 1000 * 60 * 60 * 24 * 5;     // Valid for 5 days

let BASE_INFO = {
    appVersion: app.getVersion(),
    appName: app.getName(),
    appMetrics: app.getAppMetrics(),
    chromeVersion: process.versions.chrome,
    v8Version: process.versions.v8,
    nodeVersion: process.versions.node,
    platform: os.platform(),
    isWindows
};
let logTimeout = null;
let logTime = syncLogTime();

// init
startLogTimeout();
addLog({ info: 'APP start' });
addLog({ info: BASE_INFO });
app.on('will-quit', saveSync);

module.exports = {
    info(info, isSync = true) {
        addLog({ info, isSync });
    },
    warn(info, isSync = true) {
        // console.warn(info);
        addLog({ info, level: 1, isSync });
    },
    error(info, isSync = true) {
        // console.error(new Error(info));
        addLog({ info, level: 2, isSync });
    }
};

// base
function clearLog() {
    logTime = new Date().getTime();
    clearDIR(global.LOG_PATH);
    fs.writeFileSync(LOG_DATE_PATH, logTime, 'utf8');
    formatFileName('server');
    formatFileName('client');
}

function saveSync() {
    addLog({
        path: global.SERVER_LOG_PATH,
        info: BASE_INFO
    });  // append app-base-info to server-log

    addLog({
        info: 'APP quit'
    });  // append app-quit-info to client-log

    if ((new Date().getTime() - logTime) >= validityPeriod)  {
        clearLog();
        return;
    }

    formatFileName('server');
    formatFileName('client');
}

function addLog({
    path = global.CLIENT_LOG_PATH, 
    isSync = true, 
    level = 0,
    info, 
}) {
    let logInfo = getLogInfo(info, level);

    if (!isSync) {
        log(path, logInfo);
        return;
    }

    // [NOTICE] file must be exist
    logSync(path, logInfo);
}

// utils
function clearLogTimeout() {
    clearTimeout(logTimeout);
    logTimeout = null;
}

function startLogTimeout() {
    clearLogTimeout();
    logTimeout = setTimeout(() => {
        clearLog();
        addLog({ info: 'Start from clear'});
        addLog({ info: BASE_INFO });
        startLogTimeout();
    }, validityPeriod);
}

function syncLogTime() {
    let nowDate = new Date().getTime();

    if ( !fs.existsSync(LOG_DATE_PATH) ) {
        fs.writeFileSync(LOG_DATE_PATH, nowDate, 'utf8');
        return nowDate;
    }

    let lastLogDate = fs.readFileSync(LOG_DATE_PATH);
    if (!lastLogDate) {
        fs.writeFileSync(LOG_DATE_PATH, nowDate, 'utf8');
        return nowDate;
    }

    if (nowDate - lastLogDate < validityPeriod) {
        return lastLogDate;
    }

    fs.writeFileSync(LOG_DATE_PATH, nowDate, 'utf8');
    return nowDate;
}

function clearDIR(dirPath) {
    if (!fs.existsSync(dirPath)) {
        return;
    }
    try {
        let files = fs.readdirSync(dirPath) || [];
        files.forEach(function (file) {
            let curPath = path.join(dirPath, file);
            if ( fs.statSync(curPath).isDirectory() ) { // recurse
                fs.rmdirSync(curPath);
                return;
            }
    
            if (curPath === global.SERVER_LOG_PATH || curPath === global.CLIENT_LOG_PATH) {
                return;
            }
    
            fs.unlinkSync(curPath);
        });
    } catch(err) {
        console.error(err);
    }
}

function formatFileName(type) {
    let time = new Date();
    let formatDate = `${time.getFullYear()}_${time.getMonth()+1}_${time.getDate()}` + 
                    `_${time.getHours()}_${time.getMinutes()}_${time.getSeconds()}`;
    let filename = `${type}.${formatDate}.log`;
    let oldPath = type === 'server' ? global.SERVER_LOG_PATH : global.CLIENT_LOG_PATH;
    let newPath = path.join(global.LOG_PATH, filename);
    try {
        fs.renameSync(oldPath, newPath);
    } catch(err) {
        // console.log(err);
    }
}

function formatDate(time) {
    let date = time ? new Date(time) : new Date();
    let yearFormat = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
    let hourFormat = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    return `${yearFormat} ${hourFormat}`;
}

function getLogInfo(info, level=0) {
    let levelText = ['INFO', 'WARNING', 'ERROR'][level];
    let nowDate = formatDate();
    let netStatus = global.netStatus;
    let userLocale = global.userLocale;
    return `[${levelText}] ${nowDate} | netStatus(${netStatus} | locale(${userLocale})): ${JSON.stringify(info)}\n`;
}

function log(path, logInfo) {
    fs.access(path, fs.constants.F_OK | fs.constants.W_OK, (err) => {
        if (!err) { // exist && writable
            fs.appendFile(path, logInfo, 'utf8');
            return;
        }
        
        if (err.code !== 'ENOENT') { // read-only
            console.error(`${path} 'only-read'}`);
            return;
        }

        // does not exist
        fs.writeFile(path, logInfo, 'utf8');
    });
}

function logSync(path, logInfo) {
    try {
        if (fs.existsSync(path)) {
            fs.appendFileSync(path, logInfo, 'utf8');
            return;
        }
        fs.writeFileSync(path, logInfo, 'utf8');
    } catch(err) {
        console.log(err);
    }
}
