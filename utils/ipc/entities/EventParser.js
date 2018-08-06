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
            if (!ele) {
                return;
            }
            try {
                result.push( JSON.parse(ele) );
            } catch (error) {
                console.log(error);
            }
        });
        data = null;
        return result;
    }
}

module.exports = Parser;
