const { DragBar, WindowFrame, GlobalHandler } = window.fmComponents
const { Button, TextField, Switch, styled, alpha } = window.MaterialUI
const { pink } = window.MaterialUI.colors

class FactoryPanel extends React.Component {
    constructor(p) {
        super(p)
        this.state = {
            currentAppInfo: null,
            configJSON: null,
            isEditingAppDirName: false, // 是否正在编辑标题
            editingAppDirName: '', // 正在编辑的标题
            editingAppDirNameError: false, // 正在编辑的标题是否出错
            i18n: {},
            appList: {}
        }
    }

    async componentDidMount() {
        const res = await fm.const()
        this.setState({
            i18n: res.i18n,
        })

        this.updateAppList()
        fm.on.staticFileChange(async () => {
            this.updateAppInfo()
            this.updateAppList()
            this.checkAppName(this.state.editingAppDirName)
        })
    }

    async componentDidUpdate(prevProps) {
        if (this.props.currentAppInfo !== prevProps.currentAppInfo) {
            this.updateAppInfo()
        }
    }

    // 与基座同步配置
    // 同步配置需要传入配置参数，由 onStaticFile 来触发app配置更新，再更新state
    async syncConfig(configJSON) {
        await fm.controller.setAppConfig({
            appDirName: this.state.currentAppInfo.appDirName,
            configJSON: configJSON
        })
    }

    // 更新app列表，用来做排重
    async updateAppList() {
        const appList = (await fm.controller.getAppList()).appList
        this.setState({
            appList: appList
        })
    }

    // 更新 app 配置
    async updateAppInfo() {
        const currentAppInfo = this.props.currentAppInfo
        const appConfig = await fm.controller.getAppConfig({
            appDirName: currentAppInfo.appDirName
        })
        const configJSON = appConfig.configJSON
        this.setState({
            currentAppInfo: currentAppInfo,
            configJSON: configJSON
        })
    }

    // 检查重名
    async checkAppName(inputAppName) {
        if (!this.state.isEditingAppDirName) return
        // 检查是否出错
        const appDirPrefix = this.state.currentAppInfo.appDirName.substring(
            0, this.state.currentAppInfo.appDirName.lastIndexOf('/')
        )
        const newAppDirName = appDirPrefix + '/' + inputAppName
        let error = false
        for (let key in this.state.appList) {
            if (key === newAppDirName) { // 唯一索引不能重复
                error = true
                break
            }
        }
        this.setState({
            editingAppDirNameError: error
        })
    }

    // 关闭名称修改框框
    async closeAppNameEditFrame() {
        this.setState({
            isEditingAppDirName: false,
            editingAppDirNameError: false
        })
    }

    // 打开名称修改框
    async openAppNameEditFrame() {
        this.setState({
            isEditingAppDirName: true,
            editingAppDirNameError: false,
            editingAppDirName: ''
        })
    }

    // 提交 app 名称更改
    async submitAppNameChange(newAppName) {
        if (!newAppName || newAppName === '') {
            await fm.dialog.showErrorBox({
                message: this.state.i18n['capp-newAppNameError']
            })
            return
        }
        const res = await fm.controller.setAppName({
            appDirName: this.state.currentAppInfo.appDirName,
            newAppName: newAppName
        })
        if (res.status === 2000) {
            this.closeAppNameEditFrame()
            return
        }

        await fm.dialog.showErrorBox({
            message: res.message
        })
    }

    // 删除APP
    async deleteApp(appDirName) {
        const dialogRes = await fm.dialog.showMessageBox({
            type: 'warning',
            title: this.state.i18n['capp-deleteApp'],
            message: this.state.i18n['capp-deleteAppMsg'] + appDirName,
            buttons: ['OK', 'Cancel']
        })

        if (dialogRes.result !== 0) return

        const res = await fm.controller.deleteApp({
            appDirName: appDirName
        })

        if (res.status !== 2000) {
            await fm.dialog.showErrorBox({
                message: res.message
            })
            return
        }

        location.reload()
    }

    render() {
        return (
            // 大容器：
            <div style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'flex-start',
                alignContent: 'flex-start',
                alignItems: 'center'
            }}>
                {/* 欢迎页 */}
                {!this.state.currentAppInfo && (
                    <div style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignContent: 'center',
                        alignItems: 'center'
                    }}>
                        welcome
                    </div>
                )}

                {/* app操作页面 */}
                {this.state.currentAppInfo && (
                    <div style={{
                        width: '100%',
                        display: 'flex',
                        flexWrap: 'wrap',
                        padding: '20px 20px 20px 20px'
                    }}>
                        {/* 图标 */}
                        <div style={{
                            width: '20%',
                            height: '100px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            alignContent: 'center',
                            // background: '#e1e'
                            // border: '1px solid #eee',
                            borderRadius: '10px 0px 10px 0px',
                            boxShadow: '2px 2px 4px #f30ba4, -2px -2px 4px #feea83'
                        }} className={`hvr-grow`}>
                            <img style={{
                                width: '90px',
                                height: '90px',
                                userSelect: 'none',
                            }}
                                src={this.state.currentAppInfo.icon}
                                title={`${this.state.i18n['capp-setIconTips']}`} />
                        </div>

                        {/* app信息 */}
                        <div style={{
                            width: '60%',
                            height: '100px',
                            // background: '#e1e',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'flex-start',
                            alignItems: 'flex-start',
                            alignContent: 'flex-start'
                        }}>
                            {/* 名称 */}
                            {
                                this.state.isEditingAppDirName === false ? (
                                    <div style={{
                                        fontSize: '25px',
                                        height: '60px',
                                        width: '100%',
                                        color: 'transparent',
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignContent: 'center',
                                        alignItems: 'center',
                                        paddingLeft: '20px',
                                        textShadow: '0px 0px 1px #f30ba4, 0px 0px 10px #feea83, 0px 0px 10px #feea83'
                                    }}>
                                        <div style={{
                                            overflow: 'hidden',
                                            height: '35px'
                                        }}>
                                            {
                                                this.state.currentAppInfo.appDirName.substring(
                                                    this.state.currentAppInfo.appDirName.lastIndexOf('/') + 1
                                                )
                                            }
                                        </div>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            marginLeft: '10px',
                                            cursor: 'pointer',
                                        }} onClick={() => {
                                            this.openAppNameEditFrame()
                                        }} className={`hvr-skew-forward`}>
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path stroke="#999" d="M20 21H4L8 19L18.4056 6.70242C18.7416 6.30539 18.7171 5.71713 18.3494 5.34937L16.7685 3.76848C16.3548 3.3548 15.6759 3.38304 15.298 3.82965L5 16L4 19" stroke-linecap="round" stroke-linejoin="round" />
                                            </svg>
                                        </div>
                                    </div>
                                ) : null
                            }
                            {/* 编辑中的名称 */}
                            {
                                this.state.isEditingAppDirName === true ? (
                                    <div style={{
                                        height: '60px',
                                        display: 'flex',
                                        alignItems: `center`,
                                        alignContent: 'center'
                                    }}>
                                        <TextField
                                            color="success"
                                            label={`${this.state.i18n['capp-appName']}`}
                                            helperText={`${this.state.editingAppDirNameError ?
                                                this.state.i18n['capp-newAppNameError'] : ' '
                                                }`}
                                            InputLabelProps={{
                                                style: {
                                                    fontWeight: 'bolder',
                                                    fontSize: '12px',
                                                    color: '#999'
                                                }
                                            }}
                                            error={this.state.editingAppDirNameError}
                                            value={this.state.editingAppDirName}
                                            onChange={(e) => {
                                                this.checkAppName(e.target.value)
                                                this.setState({
                                                    editingAppDirName: e.target.value,
                                                })
                                            }}
                                            variant="standard" />
                                        <div style={{
                                            width: '50px',
                                            display: 'flex',
                                            flexDirection: 'row',
                                            justifyContent: 'space-around',
                                        }}>
                                            {
                                                this.state.editingAppDirNameError ? null : (
                                                    <div style={{
                                                        cursor: 'pointer'
                                                    }} onClick={() => {
                                                        this.submitAppNameChange(
                                                            this.state.editingAppDirName
                                                        )
                                                    }} title={`${this.state.i18n['capp-confirm']}`}>
                                                        <svg version="1.1" id="icons" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                                                            width="24" height="24" viewBox="0 0 41.92 41.92" enable-background="new 0 0 41.92 41.92" space="preserve">
                                                            <g id="Icon_52_">
                                                                <circle fill="none" stroke="#66db38" stroke-width="3.92" stroke-linecap="round" stroke-miterlimit="10" cx="20.96" cy="20.96" r="19" />
                                                                <polyline fill="none" stroke="#66db38" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" points="13.091,20.338 18.483,25.87 29.091,15.87 	" />
                                                            </g>
                                                        </svg>

                                                    </div>
                                                )
                                            }
                                            <div style={{
                                                cursor: 'pointer',
                                            }} onClick={() => {
                                                this.closeAppNameEditFrame()
                                            }} title={`${this.state.i18n['capp-cancel']}`}>
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="#f08b06 " xmlns="http://www.w3.org/2000/svg">
                                                    <path stroke="#f33d46" d="M9.8788 7.05025L7.75748 4.92893C6.97643 4.14788 5.7101 4.14788 4.92905 4.92893C4.148 5.70997 4.148 6.9763 4.92905 7.75735L9.17169 12L4.92905 16.2426C4.148 17.0237 4.148 18.29 4.92905 19.0711C5.7101 19.8521 6.97643 19.8521 7.75747 19.0711L12.0001 14.8284L16.2428 19.0711C17.0238 19.8521 18.2901 19.8521 19.0712 19.0711C19.8522 18.29 19.8522 17.0237 19.0712 16.2426L14.8285 12L19.0712 7.75735C19.8522 6.97631 19.8522 5.70998 19.0712 4.92893C18.2901 4.14788 17.0238 4.14788 16.2428 4.92893L12.0001 9.17157" stroke-linecap="round" stroke-linejoin="round" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                ) : null
                            }

                            {/* 源码目录 */}
                            <div style={{
                                fontSize: '12px',
                                color: '#666',
                                marginTop: '5px',
                                cursor: 'pointer',
                                userSelect: 'none',
                                paddingLeft: '20px',
                            }} title={`${this.state.i18n['capp-openExplorer']}`} onClick={async () => {
                                await fm.controller.openExplorer({
                                    appDirName: this.state.currentAppInfo.appDirName
                                })
                            }} className={`hvr-skew-forward`}>
                                {this.state.i18n['capp-sourceCodeDir']} {this.state.currentAppInfo.appDirName}
                            </div>
                        </div>

                        {/* 启动\关闭按钮 */}
                        <div style={{
                            width: '20%',
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            {/* 按钮1 */}
                            <div style={{
                                width: '50%',
                                textAlign: 'left',
                                cursor: 'pointer'
                            }} onClick={async () => {
                                await fm.openApp({
                                    appDirName: this.state.currentAppInfo.appDirName
                                })
                            }} className="hvr-grow" title={`${this.state.i18n['capp-launchApp']}`}>
                                <svg width="33" height="33" viewBox="0 0 24 24" fill="#99ec14" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M13.5469 12.638C12.3375 13.7944 11.7213 14.6466 11.2687 15.205C11.9205 15.6009 16.6293 18.4898 18.9828 20C19.2621 13.9086 20.444 7.46193 21 5C16.4379 6.15736 7.09914 10.0761 3 11.8909L8.0431 13.7944C9.55894 12.7925 13.3725 10.4133 16.5 8.91181" stroke="#335005" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </div>
                            {/* 按钮2 */}
                            <div style={{
                                width: '50%',
                                textAlign: 'left',
                                cursor: 'pointer'
                            }} onClick={async () => {
                                await fm.controller.closeApp({
                                    appDirName: this.state.currentAppInfo.appDirName
                                })
                                await this.deleteApp(this.state.currentAppInfo.appDirName)
                            }} className={`hvr-wobble-skew`} title={`${this.state.i18n['capp-deleteAppTitle']}`}>
                                <svg width="33" height="33" viewBox="0 0 24 24" fill="#f08b06 " xmlns="http://www.w3.org/2000/svg">
                                    <path stroke="#f00606" d="M9.8788 7.05025L7.75748 4.92893C6.97643 4.14788 5.7101 4.14788 4.92905 4.92893C4.148 5.70997 4.148 6.9763 4.92905 7.75735L9.17169 12L4.92905 16.2426C4.148 17.0237 4.148 18.29 4.92905 19.0711C5.7101 19.8521 6.97643 19.8521 7.75747 19.0711L12.0001 14.8284L16.2428 19.0711C17.0238 19.8521 18.2901 19.8521 19.0712 19.0711C19.8522 18.29 19.8522 17.0237 19.0712 16.2426L14.8285 12L19.0712 7.75735C19.8522 6.97631 19.8522 5.70998 19.0712 4.92893C18.2901 4.14788 17.0238 4.14788 16.2428 4.92893L12.0001 9.17157" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </div>
                        </div>

                        {/* 配置列表 */}
                        <div style={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'hidden',
                            marginTop: '20px',
                        }}>
                            {/* {JSON.stringify(this.state.configJSON)} */}
                            {/* 控制台配置 */}
                            <div style={{
                                width: '50%',
                                display: 'flex',
                                flexDirection: 'row',
                                flexWrap: 'wrap',
                                alignItems: 'center'
                            }}>
                                <div style={{
                                }} className={`configure-menu-item `}>
                                    {this.state.i18n['capp-openDevTools']}
                                </div>
                                <div style={{
                                }} className={`configure-menu-item `}>
                                    <ConfigureSwitch checked={
                                        this.state.configJSON && this.state.configJSON.configure.devTools === true
                                    } onChange={async (e) => {
                                        const configJSON = this.state.configJSON;
                                        configJSON.configure.devTools = e.target.checked;
                                        this.syncConfig(configJSON)
                                    }} />
                                </div>

                            </div>
                        </div>
                    </div>
                )}
            </div>
        )
    }
}

// 自定义组件样式
const ConfigureSwitch = styled(Switch)(({ theme }) => ({
    '& .MuiSwitch-switchBase.Mui-checked': {
        color: pink[600],
        '&:hover': {
            backgroundColor: alpha(pink[600], theme.palette.action.hoverOpacity),
        },
    },
    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
        backgroundColor: pink[600],
    },
}));
