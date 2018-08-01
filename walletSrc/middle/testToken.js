const { net } = require('electron');

const protocol = 'https:';
const hostname = 'test.vite.net';

class TestToken {
    constructor() {}

    __getRequest(path, params, method = 'POST') {
        const request = net.request({
            method,
            protocol,
            hostname,
            path
        });
        // request.setHeader('content-type', 'application/json');
        request.setHeader('content-type', 'application/x-www-form-urlencoded;charset=utf-8');

        return new Promise((res, rej) => {
            let bodyData = '';

            request.on('response', (response) => {
                response.on('data', (chunk) => {
                    bodyData += chunk;
                });

                response.on('end', () => {
                    if (response.statusCode !== 200) {
                        rej({
                            code: response.statusCode,
                            message: 'server error'
                        });
                        return;
                    }

                    try {
                        let { code, msg, data, error } = JSON.parse(bodyData);
                        if (code !== 0) {
                            return rej({
                                code,
                                message: msg || error
                            });
                        }
                        res(data);
                    } catch(err) {
                        rej({
                            code: -1,
                            message: 'server parse error'
                        });
                    }
                });
            });
    
            // request.write(JSON.stringify(params));
            let text = '';
            for (let key in params) {
                text += `${key}=${params[key]}&`;
            }
            request.write(text);
            request.end();
        });
    }

    get(accountAddress) {
        return this.__getRequest('/api/account/newtesttoken', {
            accountAddress
        });
    }
}

module.exports = TestToken;