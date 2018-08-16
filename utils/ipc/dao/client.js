'use strict';

const net = require('net'),
    EventParser = require('../entities/EventParser.js');

let Events = require('~app/modules/event-pubsub');
let eventParser = new EventParser();

class Client extends Events{
    constructor(config){
        super();
        Object.assign(
            this,
            {
                Client  : Client,
                config  : config,
                socket  : false,
                connect : connect,
                emit    : emit,
                retriesRemaining: config.maxRetries||0,
                explicitlyDisconnected: false,
                ipcBuffer: ''
            }
        );
    }
}

function emit(type,data){
    let message = {
        type, 
        data: eventParser.format(data)
    };

    this.socket.write(message.data);
}

function connect(){
    //init client object for scope persistance especially inside of socket events.
    let client=this;

    if(!this.path){
        return;
    }

    const options = {
        path: client.path,
        id: client.id
    };

    if (process.platform ==='win32' && !options.id.startsWith('\\\\.\\pipe\\')){
        options.path = options.path.replace(/^\//, '');
        options.path = options.path.replace(/\//g, '-');
        options.path= `\\\\.\\pipe\\${options.id}`;
    }

    client.socket = net.connect(options);

    client.socket.setEncoding(this.config.encoding);

    client.socket.on(
        'error',
        function(err){
            client.publish('error', err);
        }
    );

    client.socket.on(
        'connect',
        function connectionMade(){
            client.publish('connect');
            client.retriesRemaining = client.config.maxRetries;
        }
    );

    client.socket.on(
        'close',
        function connectionClosed(){
            if(
                client.config.stopRetrying ||
                client.retriesRemaining<1 ||
                client.explicitlyDisconnected
            ){
                client.publish('disconnect');

                client.socket.destroy();
                client.publish('destroy');
                client=undefined;

                return;
            }

            setTimeout(
                function retryTimeout(){
                    client.retriesRemaining--;
                    client.connect();
                }.bind(null,client),
                client.config.retry
            );

            client.publish('disconnect');
        }
    );

    client.socket.on(
        'data',
        function(data) {
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
        }
    );
}

module.exports=Client;
