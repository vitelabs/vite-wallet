const EventTimeout = 5000;

export default function(method, arg) {
    return new Promise((res, rej) => {
        let timeout = window.setTimeout(()=>{
            window.clearTimeout(timeout);
            timeout = null;
            rej({
                code: -5000,
                message: 'timeout'
            });
        }, EventTimeout);

        function handle() {
            if (!timeout) {
                return;
            }
            window.viteWalletAPI[method](arg).then((data)=>{
                timeout && res(data);
            }).catch((err)=>{
                timeout && rej(err);
            });
        }

        if (window.viteWalletAPI) {
            handle();
            return;
        }

        let loopTimeout = window.setInterval(()=>{
            if (!window.viteWalletAPI) {
                return;
            }
            window.clearInterval(loopTimeout);
            loopTimeout = null;
            handle();
        }, 30);
    });
}
