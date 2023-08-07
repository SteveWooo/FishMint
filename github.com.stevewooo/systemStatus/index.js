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
                'networkInterfaceDefault': '*'
            }
        })).result
        this.networkInterfaceDefault = res.networkInterfaceDefault
        this.updateInfo()

        this._initPhaser()
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
        for (let i = 0; i < systemInfo.networkInterfaces.length; i++) {
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

    _initPhaser() {
        let game = null; // phaser game 对象

        // 缓存一些业务用到的对象
        let gameObjects = {}

        // 计时器
        let timer = null
        let _doUpdateInfo = async () => {
            clearTimeout(timer)
            timer = null
            const systemInfo = (await kt.system.getInfo({
                valueObject: {
                    currentLoad: 'currentLoad',
                    mem: 'used total',
                    networkInterfaces: 'ip4 iface'
                }
            })).result

            // 采集信息
            let cpuLoad = systemInfo.currentLoad.currentLoad.toFixed(2)
            let memUsage = ((systemInfo.mem.used / systemInfo.mem.total) * 100).toFixed(2)
            let ipv4 = ''
            for (let i = 0; i < systemInfo.networkInterfaces.length; i++) {
                let net = systemInfo.networkInterfaces[i]
                if (net.iface === this.networkInterfaceDefault) {
                    ipv4 = net.ip4
                    break
                }
            }
            gameObjects.panel1 && gameObjects.panel1.updateInfo({
                pre: parseFloat(cpuLoad) / 100
            })

            setTimeout(() => {
                _doUpdateInfo()
            }, 1000)
        }
        _doUpdateInfo()

        const scene = {
            key: 'mainScene',
            preload: () => {

            },
            create: () => {
                const scene = game.scene.getScene('mainScene')
                // 填充背景
                const background = scene.add.graphics()
                background.fillStyle(0xffffffff, 1)
                background.fillRect(0, 0, game.config.width, game.config.height)

                // 仪表盘
                class Panel {
                    constructor(scene) {
                        this.scene = scene
                        const colors = window.KtReactComponents.getThemeColors()
                        this.border = scene.add.graphics()
                        this.line = scene.add.graphics()
                        this.zeroLine = scene.add.graphics()
                        this.maxLine = scene.add.graphics()

                        this.radius = 30
                        this.centerPosition = [40, 40]

                        this.border.lineStyle(2, 0x111111, 1)
                        // this.border.strokeCircle(
                        //     this.centerPosition[0],
                        //     this.centerPosition[1],
                        //     this.radius
                        // )
                        this.border.beginPath()
                        this.border.arc(
                            this.centerPosition[0],
                            this.centerPosition[1],
                            this.radius,
                            0,
                            Math.PI,
                            true
                        ); // 绘制半圆
                        this.border.strokePath()

                        // 0线
                        this.zeroLine.lineStyle(2, 0x111111, 0.2)
                        this.zeroLine.lineBetween(
                            this.centerPosition[0] - this.radius,
                            this.centerPosition[1],
                            this.centerPosition[0] - this.radius * 0.7,
                            this.centerPosition[1]
                        )

                        this.maxLine.lineStyle(2, parseInt('#ff1111'.replace('#', ''), 16), 1)
                        this.maxLine.lineBetween(
                            this.centerPosition[0] + this.radius * 0.7,
                            this.centerPosition[1],
                            this.centerPosition[0] + this.radius,
                            this.centerPosition[1]
                        )

                        this.titleLable = scene.add.text(
                            this.centerPosition[0],
                            this.centerPosition[1] + 5,
                            'Cpu Load',
                            {
                                font: '8px JiangCheng',
                                fill: colors.WindowBorderColor,
                            }
                        )
                        this.titleLable.setOrigin(0.5, 0)
                    }

                    updateInfo(info) {
                        let { pre } = info
                        
                        // 约束到0.5到1
                        pre = pre / 2 + 0.5

                        this.line.clear()
                        this.line.lineStyle(2, 0x111111, 1)
                        let x = this.radius * Math.cos(2 * Math.PI * pre)
                        let y = this.radius * Math.sin(2 * Math.PI * pre)
                        this.line.lineBetween(
                            this.centerPosition[0],
                            this.centerPosition[1],
                            this.centerPosition[0] + x,
                            this.centerPosition[1] + y
                        )
                    }
                }

                const panel1 = new Panel(scene)
                panel1.updateInfo({
                    pre: 0.5
                })

                gameObjects.panel1 = panel1
            },
            update: () => {

            },
        }

        const config = {
            type: this._initPhaser.AUTO,
            width: 190,
            height: 80,
            canvas: document.getElementById('phaserCanvas'),
            scene: [scene]
        }

        game = new Phaser.Game(config)
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
                        <LinearProgress variant="determinate" value={parseFloat(this.state.memUsage)} />
                    </div>

                    <div style={{
                        width: '100%'
                    }}>
                        CPU：{this.state.cpuUsage} %
                        <LinearProgress variant="determinate" value={parseFloat(this.state.cpuUsage)} />
                    </div>

                    <div>
                        ip： {this.state.ip}
                    </div>
                </div>

                <div style={{
                    width: '100%'
                }}>
                    <canvas id="phaserCanvas"></canvas>
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