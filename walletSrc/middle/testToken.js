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
        request.setHeader('content-type', 'application/json; charset=utf-8');

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
                        let { code, msg, data } = JSON.parse(bodyData);
                        if (code !== 0) {
                            return rej({
                                code,
                                message: msg
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
    
            request.write(JSON.stringify(params));
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