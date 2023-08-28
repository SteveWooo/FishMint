(function() {
    class FMSdk {
        constructor() {
            this.configure = {
                
            }
        }
        GetConfigure() {
            return this.configure
        }
        GetQueryParams(key) {
            const params = {};
            const queryString = window.location.search.slice(1);
            const paramPairs = queryString.split('&');
            for (const pair of paramPairs) {
                const [key, value] = pair.split('=');
                params[decodeURIComponent(key)] = decodeURIComponent(value);
            }
            return params[key];
        }
        // 动态载入js文件
        define(fileArray) {
            return new Promise(resolve => {
                if (!Array.isArray(fileArray)) {
                    resolve()
                    return 
                }

                const promises = []
                for(let i = 0; i < fileArray.length; i++) {
                    promises.push(new Promise(_resolve => {
                        const script = document.createElement('script')
                        // script.type = 'text/babel'
                        script.src = fileArray[i]
                        script.onload = _resolve
                        document.body.appendChild(script)
                    }))
                }

                Promise.all(promises).then(() => {
                    resolve()
                })
            })
        }
        sleep(ms) {
            return new Promise(r => {
                setTimeout(() => {
                    r()
                }, ms)
            })
        }
    }
    window.fmSdk = new FMSdk();
})()