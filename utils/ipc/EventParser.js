const delimiter = '\n';

module.exports = {
    delimiter,

    format (message) {
        message = JSON.stringify(message);
        return message;
    },

    parse (data) {
        data = data.split(this.delimiter);
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
};
