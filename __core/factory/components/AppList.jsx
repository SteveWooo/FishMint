const { DragBar, WindowFrame, GlobalHandler } = window.fmComponents

class AppList extends React.Component {
    constructor(p) {
        super(p)
        this.state = {
            appList: {},
            activeAppDirName: ''
        }
    }

    async componentDidMount() {
        this.updateList()
    }

    async updateList() {
        const appList = (await fm.controller.getAppList()).appList
        this.setState({
            appList: appList
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
                    height: '30px',
                    background: '#f4f4f4',
                    padding: '0 10px',
                    justifyContent: 'flex-start',
                    alignItems: 'flex-start',
                    padding: '10px 0 10px 10px',
                    color: '#666',
                    cursor: 'default',
                }}>
                    Apps
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
                                    flexWrap: 'wrap',
                                    cursor: 'pointer',
                                    alignItems: 'center'
                                }} className={`${info.appDirName === this.state.activeAppDirName ? 'active-app animate__animated animate__pulse' : ''}`}
                                title={`${info.appDirName}`} onClick={() => {
                                    this.selectApp(info)
                                }}>
                                    <img src={info.icon} style={{
                                        width: '25px',
                                        height: '25px'
                                    }} />
                                    <div style={{
                                        paddingLeft: '5px',
                                        height: '35px',
                                        lineHeight: '35px',
                                        flexGrow: 1
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
                }}>
                    +
                </div>
            </div>
        )
    }
}