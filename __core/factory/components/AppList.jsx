const { DragBar, WindowFrame, GlobalHandler } = window.fmComponents
const { Select, MenuItem, styled } = window.MaterialUI

class AppList extends React.Component {
    constructor(p) {
        super(p)
        this.state = {
            appList: {},
            activeAppDirName: '',
            i18n: {},
            templates: [],
            templateListStatus: 'hide', // hide show hidding showing
        }
    }

    async componentDidMount() {
        const res = await fm.const()
        this.setState({
            i18n: res.i18n,

        })
        this.updateList()

        fm.on.staticFileChange(async () => {
            this.updateList()
        })
    }

    async componentDidUpdate(prevProps) {
        if (this.props.currentAppInfo !== prevProps.currentAppInfo) {
            if (this.props.currentAppInfo === null) {
                return
            }
            this.setState({
                activeAppDirName: this.props.currentAppInfo.appDirName
            })
        }
    }

    async updateList() {
        const appList = (await fm.controller.getAppList()).appList
        const templates = (await fm.staticService.getTemplates()).templates
        const CONST = (await fm.const()).const
        // 处理下appList
        for (const appDirName in appList) {
            if (appDirName.indexOf(CONST.FACTORY_APP_PREFIX) !== 0) {
                delete appList[appDirName]
            }
        }

        this.setState({
            appList: appList,
            templates: templates
        }, () => {
            // for debug
            // const app = appList[Object.keys(appList)[0]]
            // this.selectApp(app)
        })
    }

    async selectApp(appInfo) {
        // console.log(appInfo)
        if (appInfo == null) {
            this.props.selectApp && this.props.selectApp(null)
            this.setState({
                activeAppDirName: ''
            })
            return
        }
        this.setState({
            activeAppDirName: appInfo.appDirName
        })
        this.props.selectApp && this.props.selectApp(appInfo)
    }

    // 用模板创建一个app
    async createAppByTemplate(template) {
        const res = await fm.dialog.showMessageBox({
            title: this.state.i18n['capp-createApp'],
            type: 'warning',
            message: this.state.i18n['capp-isGoingToCreateAnApp'] + template.name,
            buttons: ['OK', 'Cancel']
        })
        if (res.result !== 0) return

        const newAppRes = await fm.controller.createApp({
            template: template.name
        })

        if (newAppRes.status !== 2000) {
            await fm.dialog.showErrorBox({
                message: newAppRes.message
            })
            return
        }
        // await fm.controller.openExplorer({
        //     appDirName: newAppRes.appDirName
        // })
        this.updateList()
        // 创建完毕后，切换app
        setTimeout(() => {
            const newAppInfo = this.state.appList[newAppRes.appDirName]
            console.log(newAppInfo)
            if (!newAppInfo) return
            this.selectApp(newAppInfo)
        }, 200)
    }

    async hideTemplateSelectMenu() {
        this.setState({ templateListStatus: 'hidding' }, () => {
            setTimeout(() => {
                if (this.state.templateListStatus !== 'hidding') return
                this.setState({ templateListStatus: 'hide' })
            }, 300)
        })
    }

    async showTemplateSelectMenu() {
        this.setState({ templateListStatus: 'showing' }, () => {
            setTimeout(() => {
                if (this.state.templateListStatus !== 'showing') return
                this.setState({ templateListStatus: 'show' })
            }, 300)
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

        this.selectApp(null)
        const res = await fm.controller.deleteApp({
            appDirName: appDirName
        })
        // console.log(res)
        if (res.status !== 2000) {
            await fm.dialog.showErrorBox({
                message: res.message
            })
            return
        }

        // location.reload()
        this.updateList()
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
                userSelect: 'none',
                overflowX: 'hidden'
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
                            const appName =
                                info.appDirName.substring(info.appDirName.lastIndexOf('/') + 1)
                            return (
                                <div key={index} style={{
                                    width: '100%',
                                    height: '35px',
                                    paddingLeft: '3px',
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
                                    <div style={{
                                        width: '10%',
                                        lineHeight: '25px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        alignContent: 'center'
                                    }}>
                                        <img src={info.icon} style={{
                                            width: '25px',
                                            height: '25px',
                                        }} />
                                    </div>
                                    <div style={{
                                        width: '80%',
                                        overflow: 'hidden',
                                    }}>

                                        <div style={{
                                            paddingLeft: '10px',
                                            height: '35px',
                                            lineHeight: '35px',
                                            flexGrow: 1,

                                        }} className={`hvr-forward`}>
                                            {appName}
                                        </div>
                                    </div>

                                    <div style={{
                                        width: '10%',
                                        cursor: 'pointer',
                                        opacity: 0.7
                                    }} onClick={async () => {
                                        await fm.controller.closeApp({
                                            appDirName: info.appDirName
                                        })
                                        await this.deleteApp(info.appDirName)
                                    }} className={`hvr-wobble-skew appListDeleteTag`} title={`${this.state.i18n['capp-deleteAppTitle']}`}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="#f08b06 " xmlns="http://www.w3.org/2000/svg">
                                            <path stroke="#f00606" d="M9.8788 7.05025L7.75748 4.92893C6.97643 4.14788 5.7101 4.14788 4.92905 4.92893C4.148 5.70997 4.148 6.9763 4.92905 7.75735L9.17169 12L4.92905 16.2426C4.148 17.0237 4.148 18.29 4.92905 19.0711C5.7101 19.8521 6.97643 19.8521 7.75747 19.0711L12.0001 14.8284L16.2428 19.0711C17.0238 19.8521 18.2901 19.8521 19.0712 19.0711C19.8522 18.29 19.8522 17.0237 19.0712 16.2426L14.8285 12L19.0712 7.75735C19.8522 6.97631 19.8522 5.70998 19.0712 4.92893C18.2901 4.14788 17.0238 4.14788 16.2428 4.92893L12.0001 9.17157" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>

                {/* 新建app */}
                <div style={{
                    width: 'calc(100% - 4px)',
                }} onMouseLeave={() => {
                    if (['show', 'showing'].includes(this.state.templateListStatus)) {

                        this.hideTemplateSelectMenu()
                    }
                }}>
                    {/* 模板选择栏 */}
                    <div style={{
                        width: 'calc(100% - 4px)',
                    }}>
                        {
                            ['showing', 'show', 'hidding'].includes(this.state.templateListStatus) ? (
                                <div style={{
                                    width: '100%',
                                    // borderTop: '1px solid #f30ba4 ',
                                    // borderRight: '1px solid #f30ba4 ',
                                    borderRadius: '0 5px 0 0 ',
                                    boxShadow: '1px -1px 4px #f30ba4'
                                }} className={`${['show', 'showing'].includes(this.state.templateListStatus) ?
                                    'template-list-show' : 'template-list-hide'}`}>
                                    <div style={{
                                        fontSize: '14px',
                                        padding: '10px 5px 5px 5px',
                                    }}>
                                        {this.state.i18n['capp-chooseYourTemplate']}
                                    </div>

                                    <div style={{
                                        width: '100%',
                                        height: '150px',
                                        overflowX: 'hidden',
                                        overflowY: 'auto'
                                    }} className={`better-scroll`}>
                                        {
                                            this.state.templates.map((item, index) => {
                                                return (
                                                    <div style={{
                                                        fontWeight: 'bold'
                                                    }}>
                                                        <CusMenuItem onClick={() => {
                                                            this.hideTemplateSelectMenu()
                                                            this.createAppByTemplate(item)
                                                        }}>{item.name}</CusMenuItem>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            ) : null
                        }
                    </div>


                    {/* 操作栏 */}
                    <div style={{
                        width: 'calc(100% - 4px)',
                        height: '30px',
                        backgroundColor: '',
                        boxShadow: '0px -1px 4px #ccc',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontSize: '12px',
                        color: '#666',
                        cursor: 'pointer',
                    }} onClick={() => {
                        if (['show', 'showing'].includes(this.state.templateListStatus)) {
                            this.hideTemplateSelectMenu()
                        }
                        if (['hide', 'hidding'].includes(this.state.templateListStatus)) {
                            this.showTemplateSelectMenu()
                        }
                    }}>
                        + {this.state.i18n['capp-createApp']}
                    </div>
                </div>

            </div>
        )
    }
}

// 自定义组件样式
const CusMenuItem = styled(MenuItem)(({ theme }) => ({
    fontSize: '14px',
    color: '#666',
    fontFamily: 'JiangCheng'
}));