const delimiter = '\n';

module.exports = {
    delimiter,

    format (requestId, methodName, arg) {
        // Simple compatible with this case.
        // If there is only one parameter, go-api needs an array containing this parameter.
        arg = arg === null ? undefined : arg;
        if (typeof arg !== 'object' && typeof arg !== 'undefined') {
            arg = [arg];
        }

        return JSON.stringify({
            jsonrpc: '2.0',
            id: requestId,
            method: methodName,
            params: arg
        });
    },

    parse (data) {
        data = data.split(this.delimiter);

        let results = [];
        data.forEach(ele => {
            if (!ele) {
                return;
            }

            try {
                let res = JSON.parse(ele);
                // Compatible: somtimes data.result is a json string, sometimes not.
                try {
                    if (res.result) {
                        res.result = JSON.parse(res.result || '');
                    }
                } catch (e) {
                    // console.log(e);
                }

                results.push(res);
            } catch (error) {
                console.log(error);
            }
        });

        data = null;
        return results;
    }
};
