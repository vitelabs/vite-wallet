const Defaults = require('./entities/Defaults.js'),
    Client = require('./dao/client.js');

class IPC{
    constructor(){
        Object.defineProperties(
            this,
            {
                config      : {
                    enumerable: true,
                    writable: true,
                    value: new Defaults
                },
                of          : {
                    enumerable: true,
                    writable: true,
                    value: {}
                }
            }
        );
    }

    disconnect (id) {
        if (!this.of[id]) {
            return;
        }
    
        this.of[id].explicitlyDisconnected = true;
    
        this.of[id].off('*','*');
        if (this.of[id].socket && this.of[id].socket.destroy) {
            this.of[id].socket.destroy();
        }
    
        delete this.of[id];
    }

    connectTo (id,path,callback) {
        if(!id){
            return;
        }
    
        if (typeof path == 'function') {
            callback = path;
            path = false;
        }
    
        if (!path) {
            path = this.config.socketRoot + this.config.appspace + id;
        }
    
        if (this.of[id]) {
            if (!this.of[id].socket.destroyed) {
                callback && callback();
                return;
            }
            this.of[id].socket.destroy();
        }
    
        this.of[id] = new Client(this.config);
        this.of[id].id = id;
        this.of[id].path = path;
    
        this.of[id].connect();
    
        callback && callback();
    }
}

module.exports = new IPC;
