const { DragBar, CmdInputter, GlobalHandler } = window.KtReactComponents

class KtRoot extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            appList: {},
            isShow: true
        }

        this.mainBodyRef = React.createRef()
        this.clickAudioRef = React.createRef()
        this.maskRef = React.createRef()
    }

    async componentDidMount() {
        const appListRes = await kt.controller.getAppList()
        // console.log(appListRes)
        this.setState({
            appList: appListRes.appList
        })
        this.maskRef.current.addEventListener('click', async e => {
            if (e.target === this.maskRef.current) {
                e.stopPropagation()
                await this.clickMask()
            }
        })

        // 监听window的出现和消失事件
        kt.on.windowShow(async (e, args) => {
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

            await this.doShow()
        })
    }
    
    getStyle() {
        const colors = window.KtReactComponents.themes[window.KtReactComponents.usingTheme]
        return {
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            flexWrap: 'wrap',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            fontFamily: 'JiangCheng',
            // backgroundColor: colors.WindowBackgroundColor,
        }
    }

    contentStyle() {
        const colors = window.KtReactComponents.themes[window.KtReactComponents.usingTheme]
        return {
            width: '100%',
            // flexGrow: 1,
            zIndex: 1,
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'row',
            alignItems: 'flex-start',
            marginTop: '200px'
        }
    }

    getMaskStyle() {
        const colors = window.KtReactComponents.themes[window.KtReactComponents.usingTheme]
        return {
            width: '100%',
            height: '100%',
            backgroundColor: '#111111cc',
            position: 'fixed',
            top: 0,
            left: 0,
            pointerEvents: 'auto',
            zIndex: 0
        }
    }

    async doHide() {
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
        this.clickAudioRef.current.play()
        await kt.openApp({
            appDirName: appDirName
        })
        await this.clickMask()
    } 

    render() {
        const colors = window.KtReactComponents.themes[window.KtReactComponents.usingTheme]
        return (
            <div style={this.getStyle()} ref={this.mainBodyRef}
                className={`${this.state.isShow ? 'fade-in' : 'fade-out'}`}
                >
                <GlobalHandler hotUpdate={true} />
                <div style={this.contentStyle()}>
                    {/* 内置App列表、选项 */}
                    <div style={{
                        width: '60%',
                        display: 'flex',
                        justifyContent: 'center',
                        border: '1px solid #eeeeee11',
                        borderRadius: '5px 5px 5px 5px',
                        color: '#fff',
                        backgroundColor: '#333333ee',
                        padding: '20px 10px 20px 10px'
                    }} className="sunshine-box-shadow">
                        <div 
                            className={`app-container sunshine-box-shadow ${this.state.isShow ? 'slide-down' : ''}`}
                            style={{
                            borderRadius: '5px 5px 5px 5px',
                            border: `1px solid ${colors.ItemBorderColor}`
                        }} onClick={() => {this.openApp("__core/appList")}}>
                            挂件库
                        </div>
                    </div>
                </div>
                <div 
                    ref={this.maskRef} 
                    style={this.getMaskStyle()}
                    className="blurred"
                ></div>
                <audio ref={this.clickAudioRef} src="/kt_app/utils/res/audios/click.mp3"></audio>
            </div>
        )
    }
}
ReactDOM.render(<KtRoot />, document.getElementById("root"))