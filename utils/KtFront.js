class KtFront {
    constructor() {
        this.configure = {
            
        }
    }
    GetConfigure() {
        return this.configure
    }
    GetWid() {
        return this.GetQueryParams('__wid')
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

    async Cmd(input) {
        const inputArr = input.split(' ')
        if (input === '/help') {
            return {
                status: 2000,
                message: `/open $AppName 打开一个app
/clear 清理输出框`
            }
        }

        if (inputArr[0] === '/open') {
            const param = input.split(' ')
            if (param.length < 2) {
                return {
                    status: 4000,
                    message: '请输入app目录名'
                }
            }

            const openRes = await kt.OpenApp({
                appDirName: param[1]
            })
            if (openRes.status !== 2000) {
                return openRes
            }
            return {
                status: 2000,
                message: ''
            }
        }

        if (inputArr[0] === '/clear') {
            return {
                status: 2000,
                message: ''
            }
        }

        return {
            status: 4003,
            message: '未知命令'
        }
    }
}
window.ktf = new KtFront();