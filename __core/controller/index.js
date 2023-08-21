const { DragBar, CmdInputter, GlobalHandler } = window.fmComponents

class FMRoot extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            appList: {},
            isShow: false,
            showStatus: 'hide',
            appBaseWidth: 0,
            appBaseHeight: 0,
            appCenterX: 0,
            appCenterY: 0
        }

        this.mainBodyRef = React.createRef()
        this.clickAudioRef = React.createRef()
        this.activeAudioRef = React.createRef()
        this.inActiveAudioRef = React.createRef()
        this.contentRef = React.createRef()
        this.backgroundRef = React.createRef()
        this.appContentRef = React.createRef()
    }

    async componentDidMount() {
        window.fmComponents.usingTheme = 'dba'
        const appListRes = await fm.controller.getAppList()
        this.setState({
            appList: appListRes.appList
        })
        await this.setPos()

        // 监听esc
        document.addEventListener('keydown', async (event) => {
            if (event.key === 'Escape') {
                this.clickMask()
            }
        });

        // 发起唤醒执行
        fm.on.windowWake(async (e, args) => {
            // console.log('do show')
            if (this.state.isShow) {
                await this.doHide()
                return
            }

            await this.doShow()
        })

        // 做鼠标跟随动画
        document.addEventListener('mousemove', (e) => {
            const mouseX = e.clientX;
            const mouseY = e.clientY;
            const offsetX = mouseX - this.state.appCenterX
            const offsetY = mouseY - this.state.appCenterY

            this.appContentRef.current.style.transform =
                `translate(${-1 * offsetX * 0.02}px, ${-1 * offsetY * 0.02}px)`
            this.backgroundRef.current.style.transform =
                `translate(${-1 * offsetX * 0.01}px, ${-1 * offsetY * 0.01}px)`
        })
    }

    // 停掉所有正在播放的音效
    async stopAllAudio() {
        const list = [
            this.clickAudioRef.current,
            this.activeAudioRef.current,
            this.inActiveAudioRef.current
        ]

        for (let i = 0; i < list.length; i++) {
            list[i].pause()
            list[i].currentTime = 0
        }
        return
    }

    async playAudio(audioElement) {
        await this.stopAllAudio()
        audioElement.play()
    }

    // 根据屏幕大小，设置好基础参数值与窗口大小
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
            // width: 400,
            // height: 400
        })

        // 设置app框的大小基准
        this.setState({
            appBaseWidth: screenInfo.bounds.width / 10,
            appBaseHeight: screenInfo.bounds.height / 10,
            appCenterX: screenInfo.bounds.width / 2,
            appCenterY: screenInfo.bounds.height / 2
        })
    }

    // 实现界面弹出和收回
    async doHide() {
        if (this.state.showStatus !== 'show') return
        await this.playAudio(this.inActiveAudioRef.current)
        this.setState({
            isShow: false,
            showStatus: 'hidding'
        }, async () => {
            setTimeout(async () => {
                this.setState({
                    showStatus: 'hide'
                })
                // await fm.window.hide()
                await fm.eWindow.__call({
                    functionName: 'minimize'
                })
            }, 200)
        })
    }
    async doShow() {
        if (this.state.showStatus !== 'hide') return
        await this.playAudio(this.activeAudioRef.current)
        await this.setPos()
        await fm.window.show()
        await fm.eWindow.__call({
            functionName: 'restore'
        })
        this.setState({
            isShow: true,
            showStatus: 'showing'
        }, () => {
            setTimeout(() => {
                this.setState({
                    showStatus: 'show'
                })
            }, 200)
        })
    }

    async clickMask() {
        await this.doHide()
    }

    async openApp(appDirName) {
        await fm.openApp({
            appDirName: appDirName
        })
        await this.clickMask()
    }

    render() {
        const colors = window.fmComponents.themes[window.fmComponents.usingTheme]
        const isHor = this.state.appBaseWidth > this.state.appBaseHeight
        return (
            <div
                style={{
                    height: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: '#1d1d1dcc',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'JiangCheng',
                    overflow: 'hidden',
                }}
                ref={this.mainBodyRef}
                onClick={() => { this.clickMask() }}
                className={`${this.state.isShow ? 'fade-in' : 'fade-out'}`}
            >
                {/* 通用全局控制器 */}
                <GlobalHandler hotUpdate={window.fmComponents.doHotUpdate} />
                {/* 标题 */}
                <div
                    className={`${this.state.isShow ? 'slide-right' : 'slide-left'} left-top-title`}>
                    - FishMint -
                </div>
                <div className={`studio-icon ${this.state.isShow ? 'slide-down' : 'slide-up'}`} style={{
                    right: `${this.state.appBaseWidth / 3}px`,
                    bottom: `${this.state.appBaseHeight * 0}px`
                }}>
                    <img src="./FishMint.png" /> 鱼昕草™工作室. All Rights Reserved.
                </div>

                {/* 内容 */}
                <div style={{
                    width: '100%',
                    height: '100%',
                    overflow: 'hidden',
                    zIndex: 1,
                    display: 'flex',
                    justifyContent: 'center',
                    flexDirection: 'row',
                    alignItems: 'flex-start'
                }} ref={this.contentRef}>
                    {/* 背景图 */}
                    <div className={`bg-img`} >
                        {/* 用来加动画的 */}
                        <div ref={this.backgroundRef} style={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <img className={`${this.state.isShow ? 'grow-big' : 'grow-small'}`}
                                style={{
                                    width: `${isHor ? '50%' : '90%'}`
                                }} src="./bg-trans-color.png" />
                        </div>
                    </div>

                    {/* 按钮挂件 */}
                    <div ref={this.appContentRef} style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex'
                    }}>
                        <div
                            className={`app-container ${this.state.isShow ? 'grow-big' : 'grow-small'}`}
                            style={{
                                width: this.state.appBaseWidth * (isHor ? 1.1 : 2.1) + 'px',
                                height: this.state.appBaseWidth * (isHor ? 1.1 : 2.1) + 'px',
                                position: 'absolute',
                                left: `${this.state.appCenterX - this.state.appBaseWidth * 2}px`,
                                top: `${this.state.appCenterY - this.state.appBaseHeight * (isHor ? 3 : 2)}px`,
                                fontSize: `${this.state.appBaseWidth * (isHor ? 0.2 : 0.45)}px`
                            }} onClick={(e) => { e.stopPropagation(); this.openApp("__core/appList") }}>
                            挂件库
                        </div>

                        <div
                            className={`app-container ${this.state.isShow ? 'grow-big' : 'grow-small'}`}
                            style={{
                                width: this.state.appBaseWidth * (isHor ? 1 : 2) + 'px',
                                height: this.state.appBaseWidth * (isHor ? 1 : 2) + 'px',
                                position: 'absolute',
                                top: this.state.appCenterY + this.state.appBaseHeight * (isHor ? 1 : 1) + 'px',
                                left: this.state.appCenterX - this.state.appBaseWidth * (isHor ? 3 : 4) + 'px',
                                fontSize: `${this.state.appBaseWidth * (isHor ? 0.2 : 0.45)}px`
                            }} onClick={() => { this.openApp("__core/setting") }}>
                            设置
                        </div>

                        <div
                            className={`app-container ${this.state.isShow ? 'grow-big' : 'grow-small'}`}
                            style={{
                                width: this.state.appBaseWidth * (isHor ? 1 : 2) + 'px',
                                height: this.state.appBaseWidth * (isHor ? 1 : 2) + 'px',
                                position: 'absolute',
                                top: this.state.appCenterY - this.state.appBaseHeight * (isHor ? 2 : 1) + 'px',
                                right: this.state.appCenterX - this.state.appBaseWidth * (isHor ? 2 : 4) + 'px',
                                fontSize: `${this.state.appBaseWidth * (isHor ? 0.2 : 0.45)}px`
                            }} onClick={() => { this.openApp("__core/factory") }}>
                            工坊
                        </div>
                    </div>
                </div>
                {/* 各个音频 */}
                <audio ref={this.clickAudioRef} src="/fm_app/utils/res/audios/click.mp3"></audio>
                <audio ref={this.activeAudioRef} src="/fm_app/__core/controller/active.mp3"></audio>
                <audio ref={this.inActiveAudioRef} src="/fm_app/__core/controller/inActive.mp3"></audio>
            </div>
        )
    }
}
ReactDOM.render(<FMRoot />, document.getElementById("root"))