const { DragBar, WindowFrame, GlobalHandler } = window.fmComponents
const { Button, TextField, Switch, Snackbar, styled, alpha } = window.MaterialUI
const { pink } = window.MaterialUI.colors

class FactoryPanel extends React.Component {
    constructor(p) {
        super(p)
        this.state = {
            currentAppInfo: null,
            configJSON: null,
            // appName 修改
            showEditAppNameIcon: false,
            isEditingAppDirName: false, // 是否正在编辑标题
            editingAppDirName: '', // 正在编辑的标题
            editingAppDirNameError: false, // 正在编辑的标题是否出错
            // browserWindow 修改
            browserWindowConfigureString: '',
            isBrowserWindowConfigureError: '',
            i18n: {},
            appList: {},

            // toast
            toastIsDoneSyncConfigure: false,
            toastNotDoneSyncConfigure: false,
            toastNotDoneSyncConfigureMessage: ''
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
            this.setState({
                isEditingAppDirName: false
            })
            this.updateAppInfo()
        }
    }

    // 与基座同步配置
    // 同步配置需要传入配置参数，由 onStaticFile 来触发app配置更新，再更新state
    async syncConfig(configJSON) {
        const res = await fm.controller.setAppConfig({
            appDirName: this.state.currentAppInfo.appDirName,
            configJSON: configJSON
        })

        if (res.status === 2000) {
            this.setState({
                toastIsDoneSyncConfigure: true
            })
        }

    }

    // 更新app列表，用来做排重
    async updateAppList(cb) {
        const appList = (await fm.controller.getAppList()).appList
        this.setState({
            appList: appList
        }, () => {
            typeof cb === 'function' && cb()
        })
    }

    // 更新 app 配置
    async updateAppInfo() {
        const currentAppInfo = this.props.currentAppInfo
        if (currentAppInfo === null) {
            this.props.selectApp && this.props.selectApp(null)
            this.setState({
                currentAppInfo: currentAppInfo
            })
            return 
        }
        const appConfig = await fm.controller.getAppConfig({
            appDirName: currentAppInfo.appDirName
        })
        if (appConfig.status !== 2000) {
            this.props.selectApp && this.props.selectApp(null)
            return 
        }
        const configJSON = appConfig.configJSON
        const browserWindowConfigureString = this.getBrowserWindowConfigString(configJSON)
        this.setState({
            currentAppInfo: currentAppInfo,
            configJSON: configJSON,
            browserWindowConfigureString: browserWindowConfigureString
        })
    }

    // ===== browserWindow配置数据流：
    // 基座 - 更新到configJSON - 解析设置到bwString绑定到textfield - 检查输入 - 更新到configJSON - 同步到基座
    // browserWindow配置 - 构建显示的字符串
    getBrowserWindowConfigString(configJSON) {
        if (!configJSON) {
            return ''
        }
        let browserWindowConfig = JSON.stringify(configJSON.browserWindowOptions, null, 4)
        return browserWindowConfig
    }

    // browserWindow配置 - 输入
    onBrowserWindowConfigureChange(e) {
        const val = e.target.value
        const check = this.checkBrowserWindowConfig(val)
        this.setState({
            browserWindowConfigureString: val,
            isBrowserWindowConfigureError: check === false
        })
    }

    // browserWindow配置 - 检查
    checkBrowserWindowConfig(configString) {
        try {
            let json = JSON.parse(configString)
            return json
        } catch (e) {
            return false
        }
    }

    // browserWindow配置 - onBlur
    onBrowserWindowConfigureTextfieldBlur() {
        let val = this.state.browserWindowConfigureString
        const json = this.checkBrowserWindowConfig(val)
        if (!json) {
            this.setState({
                isBrowserWindowConfigureError: true
            })
            return
        }

        let configJSON = this.state.configJSON
        configJSON.browserWindowOptions = json
        this.setState({
            configJSON: configJSON
        }, () => {
            this.syncConfig(configJSON)
        })
    }

    // 改名 - 检查重名
    async checkAppName(inputAppName) {
        if (!this.state.isEditingAppDirName) return
        if (!this.state.currentAppInfo) return 
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

    // 改名 - 关闭名称修改框框
    async closeAppNameEditFrame() {
        this.setState({
            isEditingAppDirName: false,
            editingAppDirNameError: false
        })
    }

    // 改名 - 打开名称修改框
    async openAppNameEditFrame() {
        this.setState({
            isEditingAppDirName: true,
            editingAppDirNameError: false,
            editingAppDirName: ''
        })
    }

    // 改名 - 提交 app 名称更改
    async submitAppNameChange(newAppName) {
        if (!newAppName || newAppName === '') {
            await fm.dialog.showErrorBox({
                message: this.state.i18n['capp-newAppNameError']
            })
            return
        }
        const appDirName = this.state.currentAppInfo.appDirName
        // this.props.selectApp && this.props.selectApp(null)
        const res = await fm.controller.setAppName({
            appDirName: appDirName,
            newAppName: newAppName
        })
        if (res.status === 2000) {
            this.closeAppNameEditFrame()
            // 小等一会儿
            this.updateAppList(() => {
                this.props.selectApp && this.props.selectApp(this.state.appList[res.appDirName])
            })
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

        this.props.selectApp && this.props.selectApp(null)
        const res = await fm.controller.deleteApp({
            appDirName: appDirName
        })
        
        if (res.status !== 2000) {
            await fm.dialog.showErrorBox({
                message: res.message
            })
            return
        }

        // location.reload()
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
                                    }} onMouseOver={() => {
                                        this.setState({
                                            showEditAppNameIcon: true
                                        })
                                    }} onMouseLeave={() => {
                                        this.setState({
                                            showEditAppNameIcon: false
                                        })
                                    }}>
                                        <div style={{
                                            overflow: 'hidden',
                                            height: '35px'
                                        }}>
                                            {
                                                this.state.currentAppInfo && 
                                                this.state.currentAppInfo.appDirName.substring(
                                                    this.state.currentAppInfo.appDirName.lastIndexOf('/') + 1
                                                )
                                            }
                                        </div>
                                        {
                                            this.state.showEditAppNameIcon ? <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                marginLeft: '5px',
                                                cursor: 'pointer',
                                            }} onClick={() => {
                                                this.openAppNameEditFrame()
                                            }} className={`hvr-skew-forward`}>
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path stroke="#666" d="M20 21H4L8 19L18.4056 6.70242C18.7416 6.30539 18.7171 5.71713 18.3494 5.34937L16.7685 3.76848C16.3548 3.3548 15.6759 3.38304 15.298 3.82965L5 16L4 19" stroke-linecap="round" stroke-linejoin="round" />
                                                </svg>
                                            </div> : null
                                        }
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
                                        alignContent: 'center',
                                        paddingLeft: '20px'
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
                                {/* {this.state.i18n['capp-sourceCodeDir']} {this.state.currentAppInfo.appDirName} */}
                                <svg version="1.1" id="icons" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                                    width="24px" height="18px" viewBox="0 0 48 42" enable-background="new 0 0 48 42" >
                                    <g id="Icon_18_">
                                        <g>
                                            <path fill="none" stroke="#999" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="
			M2,9v28.657C2,38.169,2.448,40,3,40h42c0.552,0,1-1.831,1-2.343V8.949C46,8.437,45.552,9,45,9H20"/>
                                            <path fill="none" stroke="#999" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="
			M19,7.999l-2.909-4.94c0-0.344-0.439-0.06-0.937-0.06H2.515C2.017,3,2,2.449,2,2.793V8"/>
                                        </g>
                                        <line fill="none" stroke="#999" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" x1="23" y1="2" x2="43" y2="2" />
                                    </g>
                                </svg>

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
                                alignItems: 'center',
                                fontSize: '14px'
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

                        {/* Browser View配置项 */}
                        <div style={{
                            width: '80%',
                            display: 'flex',
                            marginTop: '20px'
                        }}>
                            <ConfigureTextField
                                label={`${this.state.i18n['capp-browserWindowConfigure']}`}
                                multiline
                                fullWidth
                                color="warning"
                                helperText={`${this.state.isBrowserWindowConfigureError ?
                                    this.state.i18n['capp-browserWindowConfigureInputError'] :
                                    this.state.i18n['capp-browserWindowConfigureInputHelp']
                                    }`}
                                rows={14}
                                onBlur={() => { this.onBrowserWindowConfigureTextfieldBlur() }}
                                error={this.state.isBrowserWindowConfigureError}
                                value={this.state.browserWindowConfigureString}
                                onChange={e => { this.onBrowserWindowConfigureChange(e) }}
                            />
                        </div>
                        <div style={{
                            width: '20%'
                        }}></div>


                        {/* 提示配置已同步的 Toast */}
                        <Snackbar
                            anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "right"
                            }}
                            open={this.state.toastIsDoneSyncConfigure}
                            autoHideDuration={1500}
                            onClose={(event, reason) => {
                                if (reason === 'clickaway') {
                                    return;
                                }
                                this.setState({
                                    toastIsDoneSyncConfigure: false
                                })
                            }}
                            message={`${this.state.i18n['capp-doneSyncConfigure']}`}
                        />

                        {/* 提示同步失败的Toast */}
                        <Snackbar
                            anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "right"
                            }}
                            open={this.state.toastNotDoneSyncConfigure}
                            autoHideDuration={1500}
                            onClose={(event, reason) => {
                                if (reason === 'clickaway') {
                                    return;
                                }
                                this.setState({
                                    toastNotDoneSyncConfigure: false
                                })
                            }}
                            message={`${this.state.toastNotDoneSyncConfigureMessage}`}
                        />
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


const ConfigureTextField = styled(TextField)(({ theme }) => ({
    '& .MuiFormLabel-root': {
        fontFamily: 'JiangCheng'
    },
    '& .MuiInputBase-input': {
        fontFamily: 'JiangCheng',
        color: '#444'
    },
    '& textarea:invalid': {
        boxShadow: 'none'
    }
}));
