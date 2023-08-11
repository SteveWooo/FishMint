const { DragBar, CmdInputter, GlobalHandler } = window.KtReactComponents

class KtRoot extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            appList: {},
            isShow: false,
            appBaseWidth: 0,
            appBaseHeight: 0
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
        kt.on.windowShow(async (e, args) => {
            this.activeAudioRef.current.play()
            await this.setPos()
            await this.doShow()
        })
    }

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
            appBaseHeight: screenInfo.bounds.height / 10
        })
    }

    getStyle() {
        const colors = window.KtReactComponents.themes[window.KtReactComponents.usingTheme]
        return {
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
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
            width: '80%',
            height: '60%',
            // flexGrow: 1,
            zIndex: 1,
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'row',
            alignItems: 'flex-start'
        }
    }

    async doHide() {
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
        return (
            <div style={this.getStyle()} ref={this.mainBodyRef}
                onClick={() => { this.clickMask() }}
                className={`${this.state.isShow ? 'fade-in' : 'fade-out'}`}
            >
                <GlobalHandler hotUpdate={true} />
                <div
                    className={`${this.state.isShow ? 'slide-right' : 'slide-left'} left-top-title`}>
                    - Capybara -
                </div>
                <div style={this.contentStyle()}>
                    {/* 内置App列表、选项 */}
                    <div style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        // border: '1px solid #eeeeee11',
                        // borderRadius: '5px 5px 5px 5px',
                        color: '#fff',
                        // backgroundColor: '#333333ee',
                        padding: '20px 20px 20px 20px'
                    }} className={`click-through`}>
                        {/* 第一行 */}
                        <div style={{
                            width: '100%',
                            display: 'flex'
                        }}>
                            {/* 填满剩下的 */}
                            <div style={{
                                flexGrow: 1
                            }}></div>
                            <div 
                                className={`app-container sunshine-box-shadow ${this.state.isShow ? 'slide-down' : 'slide-up'}`}
                                style={{
                                    width: this.state.appBaseWidth * 4 + 'px',
                                    height: this.state.appBaseHeight * 3 + 'px',
                                }} onClick={(e) => { e.stopPropagation(); this.openApp("__core/appList") }}>
                                挂件库
                            </div>
                        </div>
                        {/* 第二行 */}
                        <div style={{
                            width: '100%',
                            display: 'box'
                        }}>
                            <div
                                className={`app-container sunshine-box-shadow ${this.state.isShow ? 'slide-down' : 'slide-up'}`}
                                style={{
                                    width: this.state.appBaseWidth * 3 + 'px',
                                    height: this.state.appBaseHeight * 4 + 'px',
                                    position: 'absolute',
                                    bottom: this.state.appBaseHeight * 2 + 'px'
                                }} onClick={() => { this.openApp("__core/setting") }}>
                                设置
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    ref={this.maskRef}
                    className="blurred mask"
                ></div>
                <audio ref={this.clickAudioRef} src="/kt_app/utils/res/audios/click.mp3"></audio>
                <audio ref={this.activeAudioRef} src="/kt_app/__core/controller/Capybara_Active.mp3"></audio>
                <audio ref={this.inActiveAudioRef} src="/kt_app/__core/controller/Capybara_InActive.mp3"></audio>
            </div>
        )
    }
}
ReactDOM.render(<KtRoot />, document.getElementById("root"))