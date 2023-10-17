const { DragBar, WindowFrame, GlobalHandler } = window.fmComponents

class FMRoot extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            appList: {},
            isShow: false,
            showStatus: 'hide',

            showDragTips: false
        }
        this.clickAudioRef = React.createRef()
    }

    async componentDidMount() {
        window.fmComponents.usingTheme = 'dba'
        this.updateList()
        fm.on.staticFileChange(async () => {
            // this.doHide()
            this.updateList()
        })

        this.setPos()

        fm.on.windowWake(async (e, args) => {
            if (this.state.isShow) {
                await this.doHide()
                return
            }

            await this.doShow()
        })
    }

    async doShow() {
        if (this.state.showStatus !== 'hide') return
        await this.setPos()
        // 设置一下最顶层
        await fm.eWindow.__call({
            functionName: 'setAlwaysOnTop',
            params: [true]
        })
        await fm.window.show()
        this.setState({
            isShow: true,
            showStatus: 'showing'
        }, async () => {
            setTimeout(async () => {
                this.setState({
                    showStatus: 'show'
                })
            }, 200)
        })
    }

    async doHide() {
        // console.log('doing hide')
        if (this.state.showStatus !== 'show') return
        this.setState({
            isShow: false,
            showStatus: 'hidding'
        }, async () => {
            setTimeout(async () => {
                this.setState({
                    showStatus: 'hide'
                })
                await fm.window.hide()
            }, 200)
        })
    }

    // 设置appList位置
    async setPos() {
        const cursorPoint = (await await fm.eScreen.getCursorScreenPoint()).result
        const screenInfo = (await fm.eScreen.getDisplayMatching({
            params: [{
                x: cursorPoint.x,
                y: cursorPoint.y,
                width: 1,
                height: 1
            }]
        })).result
        await fm.window.setRect({
            x: screenInfo.bounds.x,
            y: screenInfo.bounds.y,
            width: screenInfo.bounds.width,
            height: screenInfo.bounds.height,
            // x: 0,
            // y: 0,
            // width: 800,
            // height: 400
        })
    }

    async updateList() {
        const appListRes = await fm.controller.getAppList()
        const animations = [
            'animate__bounce',
            'animate__pulse',
            'animate__headShake',
            'animate__wobble',
            'animate__heartBeat',
            'animate__tada'
        ]
        for (let i in appListRes.appList) {
            const randomAnimateIndex = Math.floor(Math.random() * animations.length)
            appListRes.appList[i].cappAnimate = animations[randomAnimateIndex]
        }
        this.setState({
            appList: appListRes.appList
        })
    }

    async openApp(appDirName) {
        this.clickAudioRef.current.play()
        await fm.openApp({
            appDirName: appDirName
        })
    }

    async onDragStart(e, appInfo) {
        const dt = e.dataTransfer;
        dt.setData("text/uri-list", "");
        dt.setData("text/plain", "");
        e.dataTransfer.effectAllowed = "all";
    }

    async onDrag(e, appInfo) {

    }

    async onDragEnd(e, appInfo) {

        let pos = {
            x: e.screenX,
            y: e.screenY
        }
        await fm.openApp({
            appDirName: appInfo.appDirName,
            position: pos
        })
    }

    render() {
        const colors = window.fmComponents.getThemeColors()
        return (
            <div style={{
                width: '100vw',
                height: '100vh',
                backgroundColor: '#111111aa',
                fontFamily: 'JiangCheng'
            }} onClick={() => {
                this.doHide()
            }} onDragOver={e => {
                e.preventDefault()
            }}>
                {/* 关闭按钮 */}
                <div style={{
                    position: 'absolute',
                    color: '#ffffff66',
                    right: '150px',
                    top: '20px',
                    fontSize: '60px',
                    cursor: 'pointer',
                    userSelect: 'none'
                }} onClick={() => {
                    this.doHide()
                }}>
                    X
                </div>

                {/* drag 提示图片 */}
                {
                    this.state.showDragTips ? <div style={{
                        position: 'absolute',
                        left: '400px',
                        top: 'calc(10vh)',
                        opacity: '0.5'
                    }}>
                        <img style={{
                            width: '200px',
                            height: '200px',
                        }} src="./dragTips.png" />
                        <div style={{
                            color: 'transparent',
                            textShadow: '0 0 2px #fff, 0 0 6px #feea83',
                            position: 'absolute',
                            top: '30px',
                            left: '20px',
                            fontSize: '30px'
                        }}>
                            Drag
                        </div>
                    </div> : null
                }

                <GlobalHandler hotUpdate={window.fmComponents.doHotUpdate} />
                {/* 标题 */}
                <div style={{
                    width: '100%',
                    height: '100px',
                    display: 'flex',
                    justifyContent: 'flex-start',
                    userSelect: 'none'
                }}>
                    <div style={{
                        margin: '20px 0 0 20px',
                        color: 'transparent',
                        fontSize: '40px',
                        textShadow: '0 0 1px #feea83, 1px 1px 8px #f30ba4 '
                    }}>
                        - Apps -
                    </div>
                </div>
                {/* appList */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    background: '#333333dd',
                    justifyContent: 'flex-start',
                    alignItems: 'flex-start',
                    alignContent: 'flex-start',
                    width: '300px',
                    height: 'calc(100vh - 200px)',
                    marginLeft: '20px',
                    padding: '20px',
                    borderRadius: '5px',
                    boxShadow: '0px 0px 6px 6px #feea83',
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    userSelect: 'none',
                    animationDuration: '0.2s'
                }} className={`kt-better-scroll animate__animated ${this.state.isShow ? 'animate__backInLeft' : 'animate__backOutLeft'}`}
                    onClick={(e) => {
                        e.stopPropagation()
                    }}
                    onMouseOver={() => {
                        this.setState({
                            showDragTips: true
                        })
                    }}
                    onMouseLeave={() => {
                        this.setState({
                            showDragTips: false
                        })
                    }}>
                    {
                        Object.keys(this.state.appList).map(appDirName => {
                            const app = this.state.appList[appDirName]
                            const appName = app.appDirName.substring(
                                app.appDirName.lastIndexOf('/') + 1
                            )

                            return (
                                <div style={{
                                    width: '150px',
                                    height: '120px',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    flexDirection: 'column',
                                    overflow: 'hidden',
                                }}
                                    draggable="true"
                                    onDragStart={(e) => { this.onDragStart(e, app) }}
                                    onDragEnd={(e) => { this.onDragEnd(e, app) }}
                                    onDrag={e => { this.onDrag(e, app) }}
                                    className={`animate__animated ${this.state.isShow ? app.cappAnimate : ''}`}
                                >
                                    <img style={{
                                        width: '60px',
                                        height: '60px',
                                        // boxShadow: `${this.state.showDragTips ? '0px 0px 4px 4px #feea8322' : ''}`
                                    }} draggable="false" src={app.icon}
                                        className={`animate__animated ${this.state.showDragTips ? 'animate__heartBeat' : ''}`} />
                                    <div style={{
                                        fontSize: '15px',
                                        color: '#fff',
                                        width: '100%',
                                        height: '20px',
                                        overflow: 'hidden',
                                        textAlign: 'center'
                                    }} className={`animate__animated ${this.state.showDragTips ? 'animate__heartBeat' : ''}`}
                                    >
                                        {appName}
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
                <audio ref={this.clickAudioRef} src="/fm_app/utils/res/audios/click.mp3"></audio>
            </div>
        )
    }
}

ReactDOM.render(<FMRoot />, document.getElementById('root'))