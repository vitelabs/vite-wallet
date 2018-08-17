const { app, net } = require('electron');
const querystring = require('querystring');

const protocol = 'https:';
const hostname = 'test.vite.net';
const TIMEOUT = 10000;

function setHeader({
    request, headers = {}, type = 'json'
}) {
    for (let key in headers) {
        request.setHeader(key, headers[key]);
    }
    if (type === 'json') {
        request.setHeader('content-type', 'application/json; charset=utf-8');
    } else {
        request.setHeader('content-type', 'application/x-www-form-urlencoded; charset=utf-8');
    }
}

function parseReq({
    params, type = 'json', method
}) {
    if (method === 'GET') {
        return querystring.stringify(params);
    }

    let text = '';
    if (type !== 'json') {
        for (let key in params) {
            text += `${key}=${params[key]}&`;
        }
    } else {
        text = JSON.stringify(params);
    }

    return text;
}

module.exports = function({
    path, params, method = 'POST', headers = {}, type = 'json'
}) {
    if (!app.isReady()) {
        return Promise.reject({
            code: -50004,
            message: 'Net module must be called after the APP is ready.'
        });
    }

    if (!global.netStatus) {
        return Promise.reject({
            code: -50003,
            message: 'Net error'
        });
    }

    // Request text
    let reqText = parseReq({ params, type, method });

    if (method === 'GET') {
        path += `?${reqText}`;
    }

    const request = net.request({
        method,
        protocol,
        hostname,
        path
    });

    // setHeader
    setHeader({
        request, headers, type
    });

    return new Promise((res, rej) => {
        let bodyData = '';

        let httpTimeout = setTimeout(() => {
            request.abort();
            httpRej({
                code: -50002,
                message: 'Http server timeout.'
            });
        }, TIMEOUT);

        let cancelTimeout = () => {
            clearTimeout(httpTimeout);
            httpTimeout = null;
        };

        let httpRej = ({ code, message }) => {
            cancelTimeout();
            return rej({
                code, message
            });
        };

        request.on('response', (response) => {
            response.on('data', (chunk) => {
                bodyData += chunk;
            });

            response.on('end', () => {
                if (response.statusCode !== 200) {
                    return httpRej({
                        code: response.statusCode,
                        message: 'Http server error.'
                    });
                }

                try {
                    let { code, msg, data, error } = JSON.parse(bodyData);
                    if (code !== 0) {
                        return httpRej({
                            code,
                            message: msg || error
                        });
                    }

                    res(data || null);
                } catch(err) {
                    return httpRej({
                        code: -50001,
                        message: 'Http responce parse error.'
                    });
                }
            });
        });

        method === 'POST' && request.write(reqText);
        request.end();
    });
};
