const Client = require('./client.js');

class IPC{
    constructor(){
        this.of = {};
        this.config = {
            appspace: '',
            retry: 500,
            maxRetries: Infinity,
            stopRetrying: false,
            encoding: 'utf-8'
        };
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

    connectTo (id, callback) {
        if (!id) {
            return;
        }
    
        if (this.of[id]) {
            if (!this.of[id].socket.destroyed) {
                callback && callback();
                return;
            }
            this.of[id].socket.destroy();
        }
    
        this.of[id] = new Client({
            id, 
            config: this.config,
            path: this.config.appspace + id
        });
        this.of[id].connect();
    
        callback && callback();
    }
}

module.exports = new IPC;
