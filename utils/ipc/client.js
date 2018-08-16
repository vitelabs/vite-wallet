let Events = require('~app/modules/event-pubsub');
const net = require('net');

const eventParser = require('./EventParser.js');

class Client extends Events{
    constructor(config){
        super();

        this.Client = Client;
        this.config = config;

        this.socket = false;
        this.connect = connect;
        this.emit = emit;

        this.retriesRemaining = config.maxRetries || 0;
        this.explicitlyDisconnected = false;
        this.ipcBuffer = '';
    }
}

function emit(data){
    let message = eventParser.format(data);
    this.socket.write(message);
}

function connect () {
    if (!this.path) {
        return;
    }

    //init client object for scope persistance especially inside of socket events.
    let client = this;
    let clientPath = client.path;

    if (process.platform ==='win32' && !client.id.startsWith('\\\\.\\pipe\\')){
        clientPath = clientPath.replace(/^\//, '');
        clientPath = clientPath.replace(/\//g, '-');
        clientPath = `\\\\.\\pipe\\${ client.id }`;
    }

    client.socket = net.connect({
        path: clientPath
    });

    client.socket.setEncoding('utf-8');

    client.socket.on('error', function (err) {
        client.publish('error', err);
    });

    client.socket.on('connect', function connectionMade () {
        client.publish('connect');
        client.retriesRemaining = client.config.maxRetries;
    });

    client.socket.on('close', function connectionClosed(){
        if (client.config.stopRetrying ||
            client.retriesRemaining < 1 ||
            client.explicitlyDisconnected
        ) {
            client.publish('disconnect');
            client.socket.destroy();
            client.publish('destroy');
            client = undefined;
            return;
        }

        setTimeout(() => {
            client.retriesRemaining--;
            client.connect();
        }, client.config.retry);

        client.publish('disconnect');
    });

    client.socket.on('data', function (data) {
        if (data.slice(-1) !== eventParser.delimiter || data.indexOf(eventParser.delimiter) === -1) {
            this.ipcBuffer += data;
            return;
        }

        if (this.ipcBuffer) {
            data = this.ipcBuffer + data;
        }
        this.ipcBuffer='';

        data = eventParser.parse(data);
        data.forEach((ele) => {
            client.publish(ele.id, ele);
        });
    });
}

module.exports = Client;
