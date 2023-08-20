const { DragBar, WindowFrame, GlobalHandler } = window.fmComponents

class FMRoot extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            appList: {}
        }
        this.clickAudioRef = React.createRef()
    }

    async componentDidMount() {
        window.fmComponents.usingTheme = 'dba'
        const appListRes = await fm.controller.getAppList()
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
            <WindowFrame closeWarn={false} closeButton={true}>
                <GlobalHandler hotUpdate={window.fmComponents.doHotUpdate} />
                <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    justifyContent: 'flex-start',
                    alignItems: 'flex-start',
                    padding: '50px 0px 0px 0',
                    width: '100%',
                    height: '90%',
                    overflowY: 'auto',
                    overflowX: 'hidden'
                }} className='kt-better-scroll'>
                    {
                        Object.keys(this.state.appList).map(appDirName => {
                            const app = this.state.appList[appDirName]
                            const appName = app.appDirName.substring(
                                app.appDirName.lastIndexOf('/') + 1
                            )
                            const animations = [
                                'animate__bounce',
                                'animate__pulse',
                                'animate__headShake',
                                'animate__wobble',
                                'animate__heartBeat',
                                'animate__tada'
                            ]
                            const randomAnimateIndex = Math.floor(Math.random() * animations.length)
                            return (
                                <div style={{
                                    width: '33%',
                                    height: '120px',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    flexDirection: 'column'
                                }}
                                    draggable="true"
                                    onDragStart={(e) => { this.onDragStart(e, app) }}
                                    onDragEnd={(e) => { this.onDragEnd(e, app) }}
                                    className={`animate__animated ${animations[randomAnimateIndex]}`}
                                >
                                    <img style={{
                                        width: '60px',
                                        height: '60px'
                                    }} src={app.icon}
                                        draggable="false" />
                                    <span style={{
                                        fontSize: '15px',
                                        color: colors.ItemFontColor
                                    }}>
                                        {appName}
                                    </span>
                                </div>
                            )
                        })
                    }
                </div>
                <audio ref={this.clickAudioRef} src="/fm_app/utils/res/audios/click.mp3"></audio>
            </WindowFrame>
        )
    }
}

ReactDOM.render(<FMRoot />, document.getElementById('root'))