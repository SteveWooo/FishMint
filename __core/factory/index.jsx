const { DragBar, WindowFrame, GlobalHandler } = window.fmComponents
const { Switch, styled } = window.MaterialUI

class FMRoot extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            router: 'welcome',
            HotUpdate: false,
            currentAppInfo: ''
        }

        this.factoryPanelRef = React.createRef()
    }

    async componentDidMount() {
        const config = (await fm.configure.get()).configure
        this.setState({
            HotUpdate: config.HotUpdate
        })
    }

    async selectApp(appInfo) {
        this.setState({
            currentAppInfo: appInfo
        })
    }

    render() {
        return (
            <WindowFrame closeButton={true}>
                <GlobalHandler />
                <div style={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    alignItems: 'flex-start',
                    width: '100%',
                    height: '100%',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                }}>
                    {/* 标题 */}
                    <div style={{
                        width: '100%',
                        height: '50px',
                        display: 'flex',
                        alignItems: 'flex-start',
                    }}>
                        <div style={{
                            width: '100%',
                            height: '48px',
                            paddingLeft: '20px',
                            boxShadow: '1px 2px 4px #ccc',
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            userSelect: 'none'
                        }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                flexGrow: 1,
                                color: 'transparent',
                                textShadow: '0px 0px 1px #111, 1px 1px 1px #11111177',
                            }}>
                                <img src="./favicon.ico" style={{
                                    width: '40px',
                                    height: '40px',
                                    marginRight: '10px',
                                }} /> FishMint 工坊
                            </div>

                            {/* 热更新按钮 */}
                            <div style={{
                                width: '200px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-end',
                                color: 'transparent',
                                fontSize: '14px',
                                textShadow: '0px 0px 1px #111111, 1px 1px 1px #11111177',
                            }}>
                                热更新
                                <Android12Switch
                                    checked={this.state.HotUpdate}
                                    color="warning"
                                    onChange={async (e) => {
                                        this.setState({
                                            HotUpdate: e.target.checked
                                        })
                                        await fm.configure.set({
                                            key: 'HotUpdate',
                                            value: e.target.checked
                                        })
                                    }} />
                            </div>
                        </div>
                    </div>

                    {/* 内容 */}
                    <div style={{
                        width: '100%',
                        height: 'calc(100% - 50px)',
                        display: 'flex',
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        alignItems: 'flex-start',
                        justifyContent: 'flex-start',
                    }}>
                        {/* app列表 */}
                        <div style={{
                            width: '20%',
                            height: '100%',
                            backgroundColor: '#f5f5f5'
                        }}>
                            <AppList selectApp={(info) => {this.selectApp(info)}} />
                        </div>

                        {/* 操作面板 */}
                        <div style={{
                            width: '80%',
                            height: '100%',
                            backgroundColor: '#5f5f5f'
                        }}>
                            <FactoryPanel ref={this.factoryPanelRef} currentAppInfo={this.state.currentAppInfo} />
                        </div>
                    </div>
                </div>
            </WindowFrame>
        )
    }
}

// 自定义组件样式
const Android12Switch = styled(Switch)(({ theme }) => ({
    padding: 8,
    '& .MuiSwitch-track': {
        borderRadius: 22 / 2,
        '&:before, &:after': {
            content: '""',
            position: 'absolute',
            top: '50%',
            transform: 'translateY(-50%)',
            width: 16,
            height: 16,
        },
        '&:before': {
            backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
                theme.palette.getContrastText(theme.palette.primary.main),
            )}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
            left: 12,
        },
        '&:after': {
            backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
                theme.palette.getContrastText(theme.palette.primary.main),
            )}" d="M19,13H5V11H19V13Z" /></svg>')`,
            right: 12,
        },
    },
    '& .MuiSwitch-thumb': {
        boxShadow: 'none',
        width: 16,
        height: 16,
        margin: 2,
    },
}));

// 先加载所有js组件
ReactDOM.render(<FMRoot />, document.getElementById('root'))