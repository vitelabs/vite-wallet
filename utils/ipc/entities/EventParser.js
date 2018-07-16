'use strict';

const Defaults = require('./Defaults.js');

class Parser{
    constructor(config){
        if(!config){
            config = new Defaults;
        }
        this.delimiter=config.delimiter;
    }

    format(message){
        message = JSON.stringify(message);
        return message;
    }

    parse(data){
        data = JSON.parse(data);
        return data;
    }
}

module.exports = Parser;
