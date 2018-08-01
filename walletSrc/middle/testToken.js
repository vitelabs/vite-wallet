const request = require('../utils/http.js');

class TestToken {
    constructor() {}

    get(accountAddress) {
        return request({
            path: '/api/account/newtesttoken', 
            params: { accountAddress},
            method: 'POST',
            type: 'form'
        });
    }
}

module.exports = TestToken;