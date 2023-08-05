const { DragBar, WindowFrame } = window.KtReactComponents
const { LinearProgress } = MaterialUI;

class KtRoot extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            cpuUsage: 0,
            memUsage: 0,
            ip: ''
        }

        this.updateTimeout = null
        this.UPDATE_GAP = 1000

        this.networkInterfaceDefault = ''
    }

    async componentDidMount() {
        const res = (await kt.system.getInfo({
            valueObject: {
                'networkInterfaceDefault' : '*'
            }
        })).result
        this.networkInterfaceDefault = res.networkInterfaceDefault
        this.updateInfo()
    }

    async updateInfo() {
        const systemInfoRes = await kt.system.getInfo({
            valueObject: {
                currentLoad: 'currentLoad',
                mem: 'used total',
                networkInterfaces: 'ip4 iface'
            }
        })
        const systemInfo = systemInfoRes.result
        let ipv4 = ''
        for(let i = 0; i < systemInfo.networkInterfaces.length; i ++) {
            let net = systemInfo.networkInterfaces[i]
            if (net.iface === this.networkInterfaceDefault) {
                ipv4 = net.ip4
                break
            }
        }
        let memUsage = ((systemInfo.mem.used / systemInfo.mem.total) * 100).toFixed(2)
        
        this.setState({
            memUsage: memUsage,
            cpuUsage: systemInfo.currentLoad.currentLoad.toFixed(2),
            ip: ipv4
        })

        clearTimeout(this.updateTimeout)
        this.updateTimeout = null
        this.updateTimeout = setTimeout(() => {
            this.updateInfo()
        }, this.UPDATE_GAP)
    }

    render() {
        return (
            <WindowFrame>
                <DragBar />
                <div style={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    flexWrap: 'wrap'
                }}>
                    <div style={{
                        width: '100%'
                    }}>
                        内存：{this.state.memUsage} %
                        <LinearProgress variant="determinate" value={parseFloat(this.state.memUsage)}  />
                    </div>

                    <div style={{
                        width: '100%'
                    }}>
                        CPU：{this.state.cpuUsage} %
                        <LinearProgress variant="determinate" value={parseFloat(this.state.cpuUsage)}  />
                    </div>

                    <div>
                        ip： {this.state.ip}
                    </div>

                </div>
            </WindowFrame>
        )
    }
}

ReactDOM.render(<KtRoot />, document.getElementById("root"))
kt.window.show().then()

// ========= 实现热更新 ==========
let hotUpdate = false;
kt.on.staticFileChange(() => {
    hotUpdate = true
    location.reload()
})
// 拖动条由于设置了drag，导致这部分区域的右键菜单归系统管
// 所以在拖动栏的右键菜单上关闭窗口需要如下处理，才能保证应用窗口被关闭
window.addEventListener('beforeunload', (e) => {
    if (hotUpdate) return 

    e.preventDefault()
    e.returnValue = 'exiting'
    kt.window.close().then()
})