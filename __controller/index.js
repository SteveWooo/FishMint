const { DragBar, CmdInputter } = window.KtReactComponents

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

        // const cube = document.getElementsByClassName('cube');
        // for(let i = 0; i< cube.length; i++) {
        //     const randomDuration = Math.random() * 2 + 0.5;
        //     cube[i].style.animationDuration = `${randomDuration}s`
        // }
    }
    
    getStyle() {
        const colors = window.KtReactComponents.themes[window.KtReactComponents.usingTheme]
        return {
            height: '99vh',
            borderBottom: '2px solid ' + colors.WindowBorderColor,
            borderLeft: '2px solid ' + colors.WindowBorderColor,
            borderRight: '2px solid ' + colors.WindowBorderColor,
            // borderTop: '2px solid ' + colors.WindowBorderColor,
            borderRadius: '13px 0px 10px 10px',
            display: 'flex',
            flexDirection: 'column',
            flexWrap: 'wrap',
            alignItems: 'flex-start',
            fontFamily: 'JiangCheng',
            backgroundColor: colors.WindowBackgroundColor,
        }
    }

    contentStyle() {
        return {
            // backgroundColor: '#fff',
            width: '100%',
            // flexGrow: 1,

            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            alignItems: 'center'
        }
    }

    async openApp(appDirName) {
        this.clickAudioRef.current.play()
        await kt.openApp({
            appDirName: appDirName
        })
    } 

    render() {
        const colors = window.KtReactComponents.themes[window.KtReactComponents.usingTheme]
        return (
            <div style={this.getStyle()}>
                <DragBar></DragBar>
                <div style={this.contentStyle()}
                    className='div-container'>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        justifyContent: 'space-around',
                        // border: '1px solid red',
                        borderBottom: '2px solid ' + colors.WindowBorderColor,
                        paddingTop: '10px',
                        paddingBottom: '10px',
                        width: '100%',
                        height: '60px',
                        overflow: 'auto'
                    }}>
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
                                }} onClick={() => this.openApp(app.appDirName)}>
                                    <img style={{
                                        width: '30px'
                                    }} src={app.icon} />
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
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        marginTop: '10px'
                    }}>
                        <CmdInputter />
                    </div>
                    {/* <div style={{
                        display: 'flex',
                        flexDirection: 'row',
                        marginTop: '100px'
                    }}>
                        <div className="cube">
                            <div className="front"></div>
                            <div className="back"></div>
                        </div>
                        <div className="cube">
                            <div className="front"></div>
                            <div className="back"></div>
                        </div>
                        <div className="cube">
                            <div className="front"></div>
                            <div className="back"></div>
                        </div>
                        <div className="cube">
                            <div className="front"></div>
                            <div className="back"></div>
                        </div>
                        <div className="cube">
                            <div className="front"></div>
                            <div className="back"></div>
                        </div>
                        <div className="cube">
                            <div className="front"></div>
                            <div className="back"></div>
                        </div>
                        
                    </div> */}
                </div>

                <audio ref={this.clickAudioRef} src="../utils/res/audios/click.mp3"></audio>
            </div>
        )
    }
}
ReactDOM.render(<KtRoot />, document.getElementById("root"))

// 热更新
kt.on.staticFileChange(async (event, args) => {
    location.reload()
})

// setTimeout(async () => {
//     await kt.WindowBrocast({
//         content: {
//             hello: 'windows'
//         }
//     })
// }, 500)