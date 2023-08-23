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

    async updateList() {
        const appList = (await fm.controller.getAppList()).appList
        const templates = (await fm.staticService.getTemplates()).templates
        this.setState({
            appList: appList,
            templates: templates
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

    // 用模板创建一个app
    async createAppByTemplate(template) {
        const res = await fm.dialog.showMessageBox({
            title: this.state.i18n['capp-createApp'],
            type: 'warning',
            message: this.state.i18n['capp-isGoingToCreateAnApp'] + template.name,
            buttons: ['OK', 'Cancel']
        })
        if (res.result !== 0) return 

        console.log('createing')
        await fm.controller.createApp({
            template: template.name
        })
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

                {/* 模板选择栏 */}
                <div style={{
                    width: 'calc(100% - 4px)',
                }} onMouseLeave={() => {
                    this.hideTemplateSelectMenu()
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
                    this.showTemplateSelectMenu()
                }}>
                    {this.state.i18n['capp-createApp']}
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