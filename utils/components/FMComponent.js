window.fmComponents = {}

// 通用主题
window.fmComponents.themes = {
    "gg": {
        WindowBorderColor: '#4285f4',
        ButtonBackgroundColor: '#ea4335',
        ButtonFontColor: '#fff',
        ItemBorderColor: '#fbbc05',
        ItemFontColor: '#616161',
        WindowBackgroundColor: '#fff'
    },
    "dba": {
        ItemBackgroundColor: '#Fe4690',
        ItemBorderColor: "#FEE101",
        WindowBorderColor: '#f30ba4',
        WindowBackgroundColor: '#fff',
        ButtonFontColor: '#feea83',
        ItemFontColor: '#616161',
    }
}
window.fmComponents.usingTheme = 'dba'
window.fmComponents.getThemeColors = () => window.fmComponents.themes[window.fmComponents.usingTheme]
window.fmComponents.doHotUpdate = false
// 一些组件用的状态
window.fmComponents.status = {
    doingRefresh: false
}

/**
 * 拖动栏（因为在无frame页面中需要指定拖动物件才能拖动整个窗口）
 */
window.fmComponents.DragBar = class KtDragBar extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isMax: undefined,
            isAlwaysOnTop: undefined
        }

        this.draggerRef = React.createRef()

        // this.syncMaxState()
        this.syncOnTopState()
    }
    componentDidMount() {

    }
    // ========== 管理窗口是否保持在上 ==========
    async isAlwaysOnTop() {
        const res = await fm.eWindow.__call({
            functionName: 'isAlwaysOnTop',
        })
        return res.result
    }
    async syncOnTopState() {
        this.setState({
            isAlwaysOnTop: await this.isAlwaysOnTop()
        })
    }
    async switchAlwaysOnTop() {
        fm.window.setAlwaysOnTop({
            isAlwaysOnTop: !(await this.isAlwaysOnTop())
        })
        this.syncOnTopState()
    }
    // =========== 管理窗口最大化的(很多底层BUG，不搞) ===========
    // async isMax() {
    //     const res = await fm.eWindow.__call({
    //         functionName: 'isMaximized',
    //     })
    //     return res.result
    // }
    // async syncMaxState() {
    //     this.isMax().then(r => {
    //         this.setState({
    //             isMax: r
    //         })
    //     })
    // }
    // async restore() {
    //     const windowInfo = await fm.window.getInfo()
    //     if (windowInfo.originConfigJSON) {
    //         // let windowOpts = windowInfo.originConfigJSON.browserWindowOptions
    //         // fm.window.setRect({
    //         //     width: windowOpts.width,
    //         //     height: windowOpts.height,
    //         //     saveWindowData: true
    //         // })
    //         fm.window.restore()
    //         this.syncMaxState()
    //     }
    // }
    // async maximize() {
    //     if (this.state.isMax) {
    //         this.restore()
    //         return
    //     }

    //     // 设置最大化的屏幕坐标
    //     const cursorPoint = (await await fm.eScreen.getCursorScreenPoint()).result
    //     const screenInfo = (await fm.eScreen.getDisplayMatching({
    //         params: [{
    //             x: cursorPoint.x,
    //             y: cursorPoint.y,
    //             width: 1,
    //             height: 1
    //         }]
    //     })).result
    //     await fm.window.setRect({
    //         x: screenInfo.bounds.x,
    //         y: screenInfo.bounds.y,
    //     })
    //     fm.window.maximize()
    //     this.syncMaxState()
    // }

    style() {
        const colors = window.fmComponents.getThemeColors()
        return {
            width: '100%',
            height: '25px',
            lineHeight: '25px',
            backgroundColor: colors.WindowBorderColor,
            display: 'flex',
            justifyContent: 'flex-start',
            borderRadius: `0px 0px 0px 0px`,
            // borderBottom: '1px solid ' + colors.WindowBorderColor,
            // borderTop: '1px solid ' + colors.WindowBorderColor
        }
    }

    render() {
        const { CloseWindowButton, RefreshButton, MinimizeButton, MaximizeButton,
            PinButton } = window.fmComponents
        return (
            <div style={this.style()} ref={this.draggerRef}>
                <div style={{
                    // width: '90%'
                    flexGrow: 1
                }} className="kt-dragger" >

                </div>
                {/* <div className="div-container" style={{ width: '10%' }}>
                    {
                        this.props.refreshButton ? (
                            <RefreshButton />
                        ) : null
                    }
                </div> */}
                <div style={{
                    // width: '10%',
                    display: 'flex',
                    justifyContent: 'flex-end',
                    paddingRight: '10px'
                }}>
                    {
                        this.props.pinButton ? (
                            <PinButton
                                isAlwaysOnTop={this.state.isAlwaysOnTop}
                                switchAlwaysOnTop={() => { this.switchAlwaysOnTop() }} />
                        ) : null
                    }
                    {
                        this.props.minimizeButton ? (
                            <MinimizeButton />
                        ) : null
                    }
                    {/* {
                        this.props.maximizeButton ? (
                            <MaximizeButton
                                isMax={this.state.isMax}
                                maximize={() => { this.maximize() }}
                            />
                        ) : null
                    } */}
                    {
                        this.props.closeButton ? (
                            <CloseWindowButton closeWarn={this.props.closeWarn} />
                        ) : null
                    }
                </div>
            </div>
        )
    }
}

window.fmComponents.WindowFrame = class KtWindowFrame extends React.Component {
    constructor(props) {
        super(props)
    }

    getStyle() {
        const colors = window.fmComponents.getThemeColors()
        return {
            height: 'calc(100vh - 4px)',
            borderBottom: '2px solid ' + colors.WindowBorderColor,
            borderLeft: '2px solid ' + colors.WindowBorderColor,
            borderRight: '2px solid ' + colors.WindowBorderColor,
            borderTop: '2px solid ' + colors.WindowBorderColor,
            borderRadius: '10px 10px 10px 10px',
            display: 'flex',
            flexDirection: 'column',
            // flexWrap: 'wrap',
            alignItems: 'flex-start',
            fontFamily: 'JiangCheng',
            overflow: 'hidden',
            backgroundColor: colors.WindowBackgroundColor,
        }
    }

    render() {
        const { DragBar } = window.fmComponents
        return (
            <div style={this.getStyle()}>
                {/* drag bar */}
                <div style={{
                    width: '100%',
                    height: '25px',
                }}>
                    <DragBar {...this.props} />
                </div>
                <div style={{
                    width: '100%',
                    flexGrow: 1,
                    overflow: 'auto',
                    display: 'block',
                }}>
                    {this.props.children}
                </div>
            </div>
        )
    }
}

/**
 * 方便进行全局管理的一些组件
 */
window.fmComponents.GlobalHandler = class KtGlobalHandler extends React.Component {
    constructor(props) {
        super(props)
        window.fmComponents.status.doingRefresh = false
    }

    async componentDidMount() {
        if (this.props.hotUpdate === true) {
            fm.on.staticFileChange(() => {
                window.fmComponents.status.doingRefresh = true
                location.reload()
            })
        }

        const windowInfo = (await fm.window.getInfo()).configure
        const CONST = (await fm.const()).const
        // 拖动条由于设置了drag，导致这部分区域的右键菜单归系统管
        // 所以在拖动栏的右键菜单上关闭窗口需要如下处理，才能保证应用窗口被关闭
        window.addEventListener('beforeunload', async (e) => {
            if (window.fmComponents.status.doingRefresh) {
                return
            }
            // 控制台不用在前端处理
            if (windowInfo.__wid === CONST.CONTROLLER_APP_NAME) return
        })
    }

    render() {
        return ''
    }
}

/**
 * 关闭程序的按钮
 */
window.fmComponents.CloseWindowButton = class KtCloseWindowButton extends React.Component {
    constructor(props) {
        super(props)
        this.clickAble = true
    }

    style() {
        const colors = window.fmComponents.getThemeColors()
        return {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: colors.ButtonBackgroundColor,
            height: '100%',
            cursor: 'pointer'
        }
    }

    async closeWindow() {
        if (!this.clickAble) return
        this.clickAble = false
        // 控制台不用在前端处理
        const windowInfo = (await fm.window.getInfo()).configure
        const CONST = (await fm.const()).const
        if (windowInfo.__wid === CONST.CONTROLLER_APP_NAME) {
            await fm.window.close()
            this.clickAble = true
            return
        }

        if (this.props.closeWarn === false) {
            // 不需要提示直接退出
            await fm.window.close()
            return
        }

        // 默认需要提示警告
        const checkRes = await fm.dialog.showMessageBox({
            title: '注意',
            message: '关闭后将会删除本窗口的内容存档，您确定吗',
            type: 'warning',
            buttons: ['ok', 'cancel']
        })
        this.clickAble = true
        if (checkRes.result === 0) {
            await fm.window.close()
        }
        return
    }

    iconStyle() {
        const colors = window.fmComponents.getThemeColors()
        return {
            height: '75%'
        }
    }

    render() {
        const colors = window.fmComponents.getThemeColors()
        return (
            <div className="div-container hvr-pop"
                style={this.style()}
                onClick={() => { this.closeWindow() }}
            >
                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill={colors.ButtonFontColor}>
                    <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
                </svg>
            </div>
        )
    }
}

/**
 * 刷新按钮
 */
window.fmComponents.RefreshButton = class KtRefreshButton extends React.Component {
    constructor(props) {
        super(props)
    }

    reload() {
        window.fmComponents.status.doingRefresh = true
        location.reload()
    }

    style() {
        return {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%'
        }
    }

    iconStyle() {
        return {
            height: '60%'
        }
    }

    render() {
        const colors = window.fmComponents.getThemeColors()
        return (
            <div
                className="div-container" style={this.style()}
                onClick={this.reload}
            >
                <svg style={this.iconStyle()} width="24" height="24" viewBox="0 0 24 24" fill='none' xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 13C20 17.4183 16.4183 21 12 21C7.58172 21 4 17.4183 4 13C4 8.58172 7.58172 5 12 5C13.4571 5 14.8233 5.38958 16 6.07026L13.5 8.5H18.5L19 3L17.5 4.5" stroke={colors.ButtonFontColor} stroke-linecap="round" stroke-linejoin="round" />
                </svg>
            </div>
        )
    }
}

/**
 * 窗口放大按钮
 */
window.fmComponents.MaximizeButton = class KtMaximizeButton extends React.Component {
    constructor(props) {
        super(props)
    }
    style() {
        return {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%'
        }
    }

    iconStyle() {
        return {
            height: '60%'
        }
    }
    render() {
        const colors = window.fmComponents.getThemeColors()
        return (
            <div className="div-container" style={this.style()}
                onClick={() => { this.props.maximize() }}>
                {
                    this.props.isMax === false ? (
                        <svg xmlns="http://www.w3.org/2000/svg" height="18" viewBox="0 -960 960 960" width="18">
                            <path fill={colors.ButtonFontColor} d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Z" />
                        </svg>
                    ) : null
                }

                {
                    this.props.isMax === true ? (
                        <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20">
                            <path fill={colors.ButtonFontColor} d="M240-400v80h-80q-33 0-56.5-23.5T80-400v-400q0-33 23.5-56.5T160-880h400q33 0 56.5 23.5T640-800v80h-80v-80H160v400h80ZM400-80q-33 0-56.5-23.5T320-160v-400q0-33 23.5-56.5T400-640h400q33 0 56.5 23.5T880-560v400q0 33-23.5 56.5T800-80H400Zm0-80h400v-400H400v400Zm200-200Z" />
                        </svg>
                    ) : null
                }
            </div>
        )
    }
}

/**
 * 窗口最小化按钮
 */
window.fmComponents.MinimizeButton = class KtMinimizeButton extends React.Component {
    constructor(p) {
        super(p)
    }
    minimize() {
        // fm.window.hide()
        fm.window.minimize()
    }
    style() {
        const colors = window.fmComponents.getThemeColors()
        return {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            color: colors.ButtonFontColor,
            cursor: 'pointer'
        }
    }

    iconStyle() {
        return {
            height: '60%'
        }
    }
    render() {
        const colors = window.fmComponents.getThemeColors()
        return (
            <div className="div-container hvr-pop" style={this.style()}
                onClick={this.minimize}>
                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
                    <path d="M200-440v-80h560v80H200Z" fill={colors.ButtonFontColor} />
                </svg>
            </div>
        )
    }
}

/**
 * 窗口pin按钮
 */
window.fmComponents.PinButton = class KtPinButton extends React.Component {
    constructor(p) {
        super(p)
    }
    style() {
        const colors = window.fmComponents.getThemeColors()
        return {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            color: colors.ButtonFontColor,
            cursor: 'pointer'
        }
    }
    iconStyle() {
        return {
            height: '60%'
        }
    }
    render() {
        const colors = window.fmComponents.getThemeColors()
        return (
            <div className="div-container hvr-pop" style={this.style()}
                onClick={() => {
                    this.props.switchAlwaysOnTop()
                }}>
                {
                    this.props.isAlwaysOnTop === true ? (
                        <svg style={{
                            transform: 'rotate(-45deg)'
                        }} xmlns="http://www.w3.org/2000/svg" height="18" viewBox="0 -960 960 960" width="18">
                            <path fill={colors.ButtonFontColor} d="m640-480 80 80v80H520v240l-40 40-40-40v-240H240v-80l80-80v-280h-40v-80h400v80h-40v280Zm-286 80h252l-46-46v-314H400v314l-46 46Zm126 0Z"/>
                        </svg>
                    ) : null
                }
                {
                    this.props.isAlwaysOnTop === false ? (
                        <svg xmlns="http://www.w3.org/2000/svg" height="18" viewBox="0 -960 960 960" width="18">
                            <path fill={colors.ButtonFontColor} d="m640-480 80 80v80H520v240l-40 40-40-40v-240H240v-80l80-80v-280h-40v-80h400v80h-40v280Zm-286 80h252l-46-46v-314H400v314l-46 46Zm126 0Z"/>
                        </svg>
                    ) : null
                }
            </div>
        )
    }
}

/**
 * 命令输入框
 */
window.fmComponents.CmdInputter = class KtCmdInputter extends React.Component {
    constructor(props) {
        super(props)
        this.stats = {

        }
        this.outputRef = React.createRef()
        this.inputRef = React.createRef()
        this.clickAudioRef = React.createRef()

        this.isInputing = false;

        this.onEnterClick = this.onEnterClick.bind(this)
    }

    componentDidMount() {
        // 处理好输入框的事件
        this.inputRef.current.addEventListener("blur", () => {
            this.isInputing = false;
        })
        this.inputRef.current.addEventListener("focus", () => {
            this.isInputing = true;
        })

        // 注册回车事件
        document.addEventListener('keydown', this.onEnterClick)
    }

    async Cmd(input) {
        const inputArr = input.split(' ')
        if (input === '/help') {
            return {
                status: 2000,
                message: `/open $AppName 打开一个app
/clear 清理输出框`
            }
        }

        if (inputArr[0] === '/open') {
            const param = input.split(' ')
            if (param.length < 2) {
                return {
                    status: 4000,
                    message: '请输入app目录名'
                }
            }

            const openRes = await fm.openApp({
                appDirName: param[1]
            })
            if (openRes.status !== 2000) {
                return openRes
            }
            return {
                status: 2000,
                message: ''
            }
        }

        if (inputArr[0] === '/clear') {
            return {
                status: 2000,
                message: ''
            }
        }

        return {
            status: 4003,
            message: '未知命令'
        }
    }

    async onEnterClick(e) {
        if (e.key == "Enter" && this.isInputing) {
            // this.InputDom.blur();
            const inputValue = this.inputRef.current.value;
            this.inputRef.current.value = "";
            // 清空输出的内容
            this.outputRef.current.value = "";

            const res = await this.Cmd(inputValue)
            this.clickAudioRef.current.play()
            this.outputRef.current.value = res.message;
        }
    }

    style() {
        return {
            width: '90%',
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center'
        }
    }

    inputStyle() {
        const colors = window.fmComponents.getThemeColors()
        return {
            boxSizing: 'brder-box',
            width: '70%',
            marginTop: '15px',
            fontFamily: 'JiangCheng',
            border: '1px solid ' + colors.ItemBorderColor,
            color: colors.ItemFontColor
        }
    }

    outputStyle() {
        const colors = window.fmComponents.getThemeColors()
        return {
            border: 'none',
            width: '100%',
            height: '100px',
            fontFamily: 'JiangCheng',
            cursor: 'default',
            color: colors.ItemFontColor
        }
    }

    render() {
        return (
            <div style={this.style()}>
                <textarea
                    readonly='true'
                    className="kt-cmd-output"
                    ref={this.outputRef}
                    style={this.outputStyle()}
                ></textarea>
                <input ref={this.inputRef} style={this.inputStyle()} type="text" />
                <div style={{
                    width: '100%',
                    textAlign: 'center'
                }}>
                    <img src="/fm_app/utils/res/images/cat-sit.gif" alt="" />
                </div>

                <audio ref={this.clickAudioRef} src="/fm_app/utils/res/audios/click.mp3"></audio>
            </div>
        )
    }
}