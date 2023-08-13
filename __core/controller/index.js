const { DragBar, CmdInputter, GlobalHandler } = window.KtReactComponents

class KtRoot extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            appList: {},
            isShow: false,
            appBaseWidth: 0,
            appBaseHeight: 0,
            appCenterX: 0,
            appCenterY: 0
        }

        this.mainBodyRef = React.createRef()
        this.clickAudioRef = React.createRef()
        this.activeAudioRef = React.createRef()
        this.inActiveAudioRef = React.createRef()
        this.maskRef = React.createRef()
    }

    async componentDidMount() {
        window.KtReactComponents.usingTheme = 'dba'
        const appListRes = await kt.controller.getAppList()
        // console.log(appListRes)
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

        // 监听window的出现和消失事件
        // kt.on.windowShow(async (e, args) => {
        //     await this.stopAllAudio()
        //     this.activeAudioRef.current.play()
        //     await this.setPos()
        //     await this.doShow()
        // })

        // kt.on.windowHide(async (e, args) => {
        //     await this.doHide()
        // })

        kt.on.windowWake(async (e, args) => {
            if (this.state.isShow) {
                await this.doHide()
                return
            }

            await this.doShow()
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

    // 根据屏幕大小，设置好基础参数值与窗口大小
    async setPos() {
        const cursorPoint = (await await kt.eScreen.getCursorScreenPoint()).result
        const screenInfo = (await kt.eScreen.getDisplayMatching({
            params: [{
                x: cursorPoint.x,
                y: cursorPoint.y,
                width: 1,
                height: 1
            }]
        })).result
        // console.log(screenInfo)
        await kt.window.setRect({
            x: screenInfo.bounds.x,
            y: screenInfo.bounds.y,
            width: screenInfo.bounds.width,
            height: screenInfo.bounds.height,
            // x: 0,
            // y: 0,
            // width: 400,
            // height: 400
        })

        // 设置app框的大小
        this.setState({
            appBaseWidth: screenInfo.bounds.width / 10,
            appBaseHeight: screenInfo.bounds.height / 10,
            appCenterX: screenInfo.bounds.width / 2,
            appCenterY: screenInfo.bounds.height / 2
        })
    }

    getStyle() {
        const colors = window.KtReactComponents.themes[window.KtReactComponents.usingTheme]
        return {
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#1d1d1dcc',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'JiangCheng',
            // backgroundColor: colors.WindowBackgroundColor,
        }
    }

    contentStyle() {
        const colors = window.KtReactComponents.themes[window.KtReactComponents.usingTheme]
        return {
            width: '100%',
            height: '100%',
            // flexGrow: 1,
            zIndex: 1,
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'row',
            alignItems: 'flex-start'
        }
    }

    async doHide() {
        await this.stopAllAudio()
        this.inActiveAudioRef.current.play()
        this.setState({
            isShow: false
        }, async () => {
            setTimeout(async () => {
                await kt.window.hide()
            }, 200)
        })
    }

    async doShow() {
        await this.stopAllAudio()
        this.activeAudioRef.current.play()
        await this.setPos()
        await kt.window.show()
        this.setState({
            isShow: true
        }, () => {

        })
    }

    async clickMask() {
        await this.doHide()
    }

    async openApp(appDirName) {
        await kt.openApp({
            appDirName: appDirName
        })
        await this.clickMask()
    }

    render() {
        const colors = window.KtReactComponents.themes[window.KtReactComponents.usingTheme]
        const isHor = this.state.appBaseWidth > this.state.appBaseHeight
        return (
            <div style={this.getStyle()}
                ref={this.mainBodyRef}
                onClick={() => { this.clickMask() }}
                className={`${this.state.isShow ? 'fade-in' : 'fade-out'}`}
            >
                <GlobalHandler hotUpdate={true} />
                <div
                    className={`${this.state.isShow ? 'slide-right' : 'slide-left'} left-top-title`}>
                    - FishMint -
                </div>
                <div className={`left-top-icon ${this.state.isShow ? 'slide-right' : 'slide-left'}`}>
                    <img src="./FishMint.png" />
                </div>
                <div style={this.contentStyle()}>
                    <div style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex'
                    }}>
                        <div
                            className={`app-container sunshine-box-shadow ${this.state.isShow ? 'slide-down' : 'slide-up'}`}
                            style={{
                                width: this.state.appBaseWidth * (isHor ? 1 : 2) + 'px',
                                height: this.state.appBaseWidth * (isHor ? 1 : 2) + 'px',
                                position: 'absolute',
                                left: `${this.state.appCenterX - this.state.appBaseWidth * 2}px`,
                                top: `${this.state.appCenterY - this.state.appBaseHeight * (isHor ? 3 : 2)}px`,
                                fontSize: `${this.state.appBaseWidth * (isHor ? 0.2 : 0.5)}px`
                            }} onClick={(e) => { e.stopPropagation(); this.openApp("__core/appList") }}>
                            挂件库
                        </div>

                        <div
                            className={`app-container sunshine-box-shadow ${this.state.isShow ? 'slide-down' : 'slide-up'}`}
                            style={{
                                width: this.state.appBaseWidth * (isHor ? 1 : 2) + 'px',
                                height: this.state.appBaseWidth * (isHor ? 1 : 2) + 'px',
                                position: 'absolute',
                                top: this.state.appCenterY + this.state.appBaseHeight * (isHor ? 1 : 1) + 'px',
                                left: this.state.appCenterX - this.state.appBaseWidth * (isHor ? 3 : 4) + "px",
                                fontSize: `${this.state.appBaseWidth * (isHor ? 0.2 : 0.5)}px`
                            }} onClick={() => { this.openApp("__core/setting") }}>
                            设置
                        </div>
                    </div>
                </div>
                {/* <div
                    ref={this.maskRef}
                    className="blurred mask"
                ></div> */}
                <div className={`bg-img`}>
                    <img className={`${this.state.isShow ? 'grow-big' : 'grow-small'}`} 
                        style={{
                        width: `${isHor ? '50%' : '90%'}`
                    }} src="./bg-trans-color.png" />
                </div>
                <audio ref={this.clickAudioRef} src="/kt_app/utils/res/audios/click.mp3"></audio>
                <audio ref={this.activeAudioRef} src="/kt_app/__core/controller/Capybara_Active.mp3"></audio>
                <audio ref={this.inActiveAudioRef} src="/kt_app/__core/controller/Capybara_InActive.mp3"></audio>
            </div>
        )
    }
}
ReactDOM.render(<KtRoot />, document.getElementById("root"))