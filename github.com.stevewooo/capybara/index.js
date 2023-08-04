const { WindowFrame, DragBar, CmdInputter, NoteTextarea } = window.KtReactComponents

const OBJ_LIST = {
    CAPYBARA: 'capybara',
    LEAF: 'leaf'
}

const EVENT_TYPE = {
    EAT_LEAVE: 'eatLeave',
    MOVED: 'moved'
}

const MAX_LEAF = 0;

// 上下边界
const TOP_GAP = 50
const BOTTOM_GAP = 50
const LEFT_GAP = 20
const RIGHT_GAP = 20

class KtRoot extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
        // this.isDragging = false
        this.bodyRef = React.createRef()

        this.createLeafTimeout = null
        // this.mouseOffsetX = 0
        // this.mouseOffsetY = 0

        this.doCreateLeaf = this.doCreateLeaf.bind(this)
    }

    async componentDidMount() {
        let appInfo = await kt.window.getAppInfo()
        let windowInfo = await kt.window.getInfo()
        if (windowInfo.startupArgs && windowInfo.startupArgs.obj === OBJ_LIST.LEAF) {
            this._initLeaf()
        } else {
            this._initCapybara()
        }
    }
    // 判断2个窗口是否碰撞
    areRectanglesColliding(rect1, rect2) {
        // 计算矩形的边界
        const left1 = rect1.x + LEFT_GAP;
        const right1 = rect1.x + rect1.width - RIGHT_GAP;
        const top1 = rect1.y + TOP_GAP;
        const bottom1 = rect1.y + rect1.height - 50;

        const left2 = rect2.x;
        const right2 = rect2.x + rect2.width;
        const top2 = rect2.y;
        const bottom2 = rect2.y + rect2.height;

        // 检查是否有碰撞
        if (left1 < right2 && right1 > left2 && top1 < bottom2 && bottom1 > top2) {
            return true; // 碰撞
        } else {
            return false; // 无碰撞
        }
    }

    async _initCapybara() {
        this.setState({
            obj: OBJ_LIST.CAPYBARA
        })
        // 处理水豚的逻辑
        kt.on.windowBrocast(async (e, data) => {
            if (data.content.event === EVENT_TYPE.MOVED) {
                this.checkLeafCouldEat()
            }
        })
        kt.on.windowMoved(async (e, data) => {
            this.checkLeafCouldEat()
        })

        // 持续生成叶子
        this.doCreateLeaf()

        // 修改位置和大小
        const screenInfo = (await kt.eScreen.getPrimaryDisplay()).result
        await kt.window.setRect({
            x: screenInfo.workArea.width - 220,
            y: screenInfo.workArea.height - 300,
            width: 200,
            height: 200
        })
    }

    async _initLeaf() {
        this.setState({
            obj: OBJ_LIST.LEAF
        })

        // 随机出现屏幕上方
        const screenInfo = (await kt.eScreen.getPrimaryDisplay()).result
        let xMax = screenInfo.workArea.width - 200
        let yMax = 300

        let x = Math.random() * (xMax - 20) + 20
        let y = Math.random() * (yMax - 20) + 20

        await kt.window.setRect({
            x: x,
            y: y,
            width: 50,
            height: 50
        })

        // 处理叶子的逻辑
        await kt.on.windowMoved(async (e, data) => {
            await kt.windowBrocast({
                content: {
                    event: EVENT_TYPE.MOVED,
                    obj: OBJ_LIST.LEAF
                }
            })
        })
    }

    async doCreateLeaf() {
        let appInfo = await kt.window.getAppInfo()
        if (Object.keys(appInfo.windows).length < MAX_LEAF + 1) { 
            await kt.openApp({
                appDirName: 'github.com.stevewooo/capybara',
                startupArgs: {
                    obj: OBJ_LIST.LEAF
                }
            })
        }
        clearTimeout(this.createLeafTimeout)
        this.createLeafTimeout = null
        this.createLeafTimeout = setTimeout(async () => {
            this.doCreateLeaf()
        }, 10 * 1000 + Math.random() * 10)
    }

    // 检查是否有叶子可以吃
    async checkLeafCouldEat() {
        let appWindows = (await kt.window.getAppInfo()).windows
        let configure = (await kt.window.getInfo()).configure
        for(let __wid in appWindows) {
            if (__wid === configure.__wid) continue 

            if (this.areRectanglesColliding(configure, appWindows[__wid].configure)) {
                kt.closeWindow({
                    __wid: __wid
                })
            }
        }
    }

    render() {
        return (
            <div ref={this.bodyRef} style={{
                border: '0px solid #eee'
            }}>
                {/* <DragBar></DragBar> */}
                {
                    (this.state.obj === OBJ_LIST.CAPYBARA) ? (
                        <div style={{
                            flexGrow: 1,
                            width: '100%',
                            height: 'auto',
                            display: 'flex',
                            justifyContent: 'center',
                            pointerEvents: 'none'
                        }} className="kt-dragger">
                            <img src="/kt_app/favicon.ico" draggable="false" style={{
                                width: '100%',
                                height: 'auto'
                            }} />
                        </div>
                    ) : undefined
                }

                {
                    (this.state.obj === OBJ_LIST.LEAF) ? (
                        <div style={{
                            width: '100%',
                            height: '100%',
                            flexGrow: 1,
                            fontSize: '30px',
                            display: 'flex',
                            justifyContent: 'center'
                        }} className="kt-dragger">
                            🍃
                        </div>
                    ) : undefined
                }
            </div>
        )
    }
}

let hotUpdate = false;
// 热更新
kt.on.staticFileChange(async (event, args) => {
    hotUpdate = true
    location.reload()
})

// 主页关闭的话，其他也可以关掉了
window.addEventListener('beforeunload', async e => {
    if (!hotUpdate) {
        e.preventDefault()
        e.returnValue = '确定要离开吗？';
        let windowInfo = await kt.window.getInfo()
        if (windowInfo.startupArgs && windowInfo.startupArgs.obj === OBJ_LIST.LEAF) {
            await kt.closeWindow()
            return 
        }
        // 将所有应用内的应用都关闭，然后再离开
        const appInfos = (await kt.window.getAppInfo())
        for(let wid in appInfos.windows) { 
            if (wid === windowInfo.__wid) continue
            await kt.closeWindow({
                __wid: wid
            })
        } 

        await kt.closeWindow()
    }
})

ReactDOM.render(<KtRoot />, document.getElementById("root"))
kt.window.show().then()