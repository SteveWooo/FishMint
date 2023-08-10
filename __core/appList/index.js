const { DragBar, WindowFrame, GlobalHandler } = window.KtReactComponents

class KtRoot extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            appList: {}
        }
        this.clickAudioRef = React.createRef()
    }

    async componentDidMount() {
        const appListRes = await kt.controller.getAppList()
        // console.log(appListRes)
        this.setState({ 
            appList: appListRes.appList
        })

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
        const rect = {
            width: 1/3 * screenInfo.workArea.width,
            height: 1/3 * screenInfo.workArea.height
        }
        await kt.window.setRect({
            x: screenInfo.workArea.x + Math.floor(screenInfo.workArea.width / 2 - rect.width / 2),
            y: Math.floor(screenInfo.workArea.height / 2 - rect.height / 2),
            width: Math.floor(rect.width),
            height: Math.floor(rect.height),
        }) 
    }

    async openApp(appDirName) {
        this.clickAudioRef.current.play()
        await kt.openApp({
            appDirName: appDirName
        })
    }

    async onDragStart(e, appInfo) {

    }

    async onDragEnd(e, appInfo) {
        let pos = {
            x: e.screenX,
            y: e.screenY
        }
        await kt.openApp({
            appDirName: appInfo.appDirName,
            position: pos
        })
    }

    render() {
        const colors = window.KtReactComponents.themes[window.KtReactComponents.usingTheme]
        return (
            <WindowFrame>
                <GlobalHandler hotUpdate={true} />
                <DragBar />
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    flexGrow: 1
                }}>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        justifyContent: 'space-around',
                        // border: '1px solid red',
                        paddingTop: '10px',
                        paddingBottom: '10px',
                        width: '100%',
                        height: '90%',
                        overflow: 'auto'
                    }} className='kt-better-scroll'>
                        {
                            Object.keys(this.state.appList).map(appDirName => {
                                const app = this.state.appList[appDirName]
                                const appName = app.appDirName.substring(
                                    app.appDirName.lastIndexOf('/') + 1
                                )
                                return (
                                    <div style={{
                                        width: '80px',
                                        height: '50px',
                                        // border: '1px solid #111',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        flexDirection: 'column'
                                    }} 
                                    // onClick={() => this.openApp(app.appDirName)}
                                    draggable="true"
                                    onDragStart={(e) => {this.onDragStart(e, app)}} 
                                    onDragEnd={(e) => {this.onDragEnd(e, app)}}
                                    >
                                        <img style={{
                                            width: '30px'
                                        }} src={app.icon} 
                                        draggable="false"/>
                                        <span style={{
                                            fontSize: '10px'
                                        }}>
                                            {appName}
                                        </span>
                                    </div>
                                )
                            })
                        }
                    </div>
                    <audio ref={this.clickAudioRef} src="/kt_app/utils/res/audios/click.mp3"></audio>
                </div>
            </WindowFrame>
        )
    }
}

ReactDOM.render(<KtRoot />, document.getElementById('root'))