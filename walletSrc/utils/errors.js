module.exports = {
    NO_DATA: function(dataName) {
        return {
            code: -3000,
            message: `Don\'t have this ${dataName}.`
        };
    }
};