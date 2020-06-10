const { app, net } = require('electron');
const querystring = require('querystring');

const protocol = 'https:';
const HOSTNAME = 'x.vite.net';
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
    path, params, method = 'POST', headers = {}, type = 'json', timeout = TIMEOUT, hostname = HOSTNAME
}) {
    let originalPath = path;

    if (!app.isReady()) {
        let message = 'Net module must be called after the APP is ready.';

        global.walletLog.error(`HTTP ${originalPath}: ${message}`);
        return Promise.reject({
            code: -50004,
            message
        });
    }

    if (!global.netStatus) {
        global.walletLog.error(`HTTP ${originalPath}: Net error`);
        return Promise.reject({
            code: -50003,
            message: 'Net error'
        });
    }

    try {
        // Request text
        let reqText = parseReq({ params, type, method });

        if (method === 'GET' && params && reqText) {
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
            }, timeout);

            let cancelTimeout = () => {
                clearTimeout(httpTimeout);
                httpTimeout = null;
            };

            let httpRej = ({ code, message }) => {
                global.walletLog.error(`HTTP ${originalPath}: ${message}`);

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
                        let rightCode = hostname.indexOf('gate') !== -1 ? 200 : 0;

                        if (code !== rightCode) {
                            return httpRej({
                                code,
                                message: msg || error
                            });
                        }

                        data = data || null;

                        global.walletLog.info(`HTTP ${originalPath}: ${JSON.stringify(data)}`);
                        cancelTimeout();
                        res(data);
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
    } catch(err) {
        global.walletLog.error(`HTTP ${originalPath}: Net catch error, ${JSON.stringify(err)}`);
        return Promise.reject({
            code: -50006,
            message: JSON.stringify(err)
        });
    }
};
