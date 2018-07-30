const { net } = require('electron');

const protocol = 'https:';
const hostname = 'test.vite.net';

class HttpAPIs {
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
                        let { data } = JSON.parse(bodyData);
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

    getTransList() {
        // [test code]
        // return this.__getRequest('/api/transaction/list', {
        //     accountAddress: 'vite_60f445d22ecef16fa8ff746b9e279afd8eee796b3e27805ec2',
        //     paging: {
        //         index: 0, 
        //         count: 6
        //     }
        // });
    }

    getTestToken() {
        
    }
}

module.exports = HttpAPIs;