const os = require('os');

class Defaults{
    constructor(){

        this.appspace = 'app.';
        this.socketRoot = '/tmp/';
        this.id = os.hostname();

        this.sync = false;
        this.unlink = true;

        this.maxConnections = 100;
        this.retry = 500;
        this.maxRetries = Infinity;
        this.stopRetrying = false;
    }
}

module.exports=Defaults;
