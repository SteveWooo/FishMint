const { DragBar, WindowFrame, GlobalHandler } = window.fmComponents

class AppList extends React.Component {
    constructor(p) {
        super(p)
        this.state = {
            appList: {},
            activeAppDirName: '',
            i18n: {}
        }
    }

    async componentDidMount() {
        const res = await fm.const()
        this.setState({
            i18n: res.i18n
        })
        this.updateList()

        fm.on.staticFileChange(async () => {
            this.updateList()
        })
    }

    async updateList() {
        const appList = (await fm.controller.getAppList()).appList
        this.setState({
            appList: appList
        }, () => {
            // for debug
            const app = appList[Object.keys(appList)[0]]
            this.selectApp(app)
        })
    }

    async selectApp(appInfo) {
        this.setState({
            activeAppDirName: appInfo.appDirName
        })

        this.props.selectApp && this.props.selectApp(appInfo)
    }

    render() {
        return (
            <div style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                userSelect: 'none'
            }}>
                {/* 列表标题 */}
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    width: '100%',
                    // background: '#ddd',
                    height: '50px',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    color: '#666',
                    cursor: 'default',
                    borderBottom: '1px solid #ccc',
                    // boxShadow: '0px 2px 1px #ccc'
                }}>
                    <div style={{
                        padding: '0px 0 0px 20px',
                        lineHeight: '50px'
                    }}> Apps</div>
                </div>
                {/* 列表 */}
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'flex-start',
                    justifyContent: 'flex-start',
                    alignContent: 'flex-start',
                    width: '100%',
                    flexGrow: 1,
                    overflow: 'hidden'
                }}>
                    {
                        Object.keys(this.state.appList).map((app, index) => {
                            const info = this.state.appList[app]
                            const appName = info.appDirName.substring(info.appDirName.lastIndexOf('/') + 1)
                            return (
                                <div key={index} style={{
                                    width: '100%',
                                    height: '35px',
                                    fontSize: '14px',
                                    display: 'flex',
                                    flexWrap: 'nowrap',
                                    cursor: 'pointer',
                                    alignItems: 'center',
                                    overflow: 'hidden'
                                }} className={`${info.appDirName === this.state.activeAppDirName ? 'active-app animate__animated animate__pulse' : ''}`}
                                title={`${info.appDirName}`} onClick={() => {
                                    this.selectApp(info)
                                }}>
                                    <img src={info.icon} style={{
                                        width: '25px',
                                        height: '25px',
                                        marginLeft: '5px'
                                    }} />
                                    <div style={{
                                        paddingLeft: '10px',
                                        height: '35px',
                                        lineHeight: '35px',
                                        flexGrow: 1,
                                    }} className={`hvr-forward`}>
                                        {appName}
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>

                {/* 操作栏 */}

                <div style={{
                    width: '100%',
                    height: '30px',
                    backgroundColor: '',
                    boxShadow: '0px -1px 4px #ccc',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontSize: '18px',
                    color: '#666',
                    cursor: 'pointer'
                }} onClick={async () => {
                    await fm.controller.createApp({template: 'demo'})
                }}>
                    +
                </div>
            </div>
        )
    }
}