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
        data = data.split('\n');
        let result = [];
        data.forEach(ele => {
            ele && result.push(JSON.parse(ele));
        });
        data = null;
        return result;
    }
}

module.exports = Parser;
