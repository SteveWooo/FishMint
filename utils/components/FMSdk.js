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
    }
    window.fmSdk = new FMSdk();
})()