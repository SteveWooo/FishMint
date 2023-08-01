window.KtReactComponents = {}

// 通用主题
window.KtReactComponents.themes = {
    "gg": {
        WindowBorderColor: '#4285f4',
        ButtonBackgroundColor: '#ea4335',
        ButtonFontColor: '#fff',
        ItemBorderColor: '#fbbc05',
        ItemFontColor: '#616161',
        WindowBackgroundColor: '#fff'
    }
}
window.KtReactComponents.usingTheme = 'gg'
window.KtReactComponents.getThemeColors = () => window.KtReactComponents.themes[window.KtReactComponents.usingTheme]

/**
 * 拖动栏（因为在无frame页面中需要指定拖动物件才能拖动整个窗口）
 */
window.KtReactComponents.DragBar = class KtDragBar extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    style() {
        const colors = window.KtReactComponents.getThemeColors()
        return {
            width: '100%',
            height: '25px',
            lineHeight: '25px',
            backgroundColor: colors.WindowBorderColor,
            display: 'flex',
            justifyContent: 'flex-start',
            borderRadius: '10px 0px 0 0',
            borderBottom: '1px solid ' + colors.WindowBorderColor,
            borderTop: '1px solid ' + colors.WindowBorderColor
        }
    }

    render() {
        const { CloseWindowButton, RefreshButton } = window.KtReactComponents
        return (
            <div style={this.style()}>
                <div style={{width: '80%'}} className="kt-dragger">

                </div>
                <div className="div-container" style={{width: '10%'}}>
                    <RefreshButton />
                </div>
                <div style={{width: '10%'}}>
                    <CloseWindowButton />
                </div>
            </div>
        )
    }
}

window.KtReactComponents.WindowFrame = class KtWindowFrame extends React.Component {
    constructor(props) {
        super(props)
    }

    getStyle() {
        const colors = window.KtReactComponents.getThemeColors()
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

    render() {
        return (
            <div style={this.getStyle()}>
                { this.props.children }
            </div>
        )
    }
}

/**
 * 关闭程序的按钮
 */
window.KtReactComponents.CloseWindowButton = class KtCloseWindowButton extends React.Component {
    constructor(props) {
        super(props)
    }

    style() {
        const colors = window.KtReactComponents.getThemeColors()
        return {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: colors.ButtonBackgroundColor,
            height: '100%'
        }
    }

    closeWindow() {
        kt.CloseWindow({})
    }

    iconStyle() {
        const colors = window.KtReactComponents.getThemeColors()
        return {
            height: '75%'
        }
    }

    render() {
        const colors = window.KtReactComponents.getThemeColors()
        return (
            <div className="div-container" 
                style={this.style()}
                onClick={this.closeWindow}
            >
                <svg style={this.iconStyle()} width="24" height="24" viewBox="0 0 24 24" fill={colors.ButtonFontColor} xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.8788 7.05025L7.75748 4.92893C6.97643 4.14788 5.7101 4.14788 4.92905 4.92893C4.148 5.70997 4.148 6.9763 4.92905 7.75735L9.17169 12L4.92905 16.2426C4.148 17.0237 4.148 18.29 4.92905 19.0711C5.7101 19.8521 6.97643 19.8521 7.75747 19.0711L12.0001 14.8284L16.2428 19.0711C17.0238 19.8521 18.2901 19.8521 19.0712 19.0711C19.8522 18.29 19.8522 17.0237 19.0712 16.2426L14.8285 12L19.0712 7.75735C19.8522 6.97631 19.8522 5.70998 19.0712 4.92893C18.2901 4.14788 17.0238 4.14788 16.2428 4.92893L12.0001 9.17157" stroke={colors.ButtonFontColor} stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
        )
    }
}

/**
 * 刷新按钮
 */
window.KtReactComponents.RefreshButton = class KtRefreshButton extends React.Component {
    constructor(props) {
        super(props)
    }

    reload() {
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
        const colors = window.KtReactComponents.getThemeColors()
        return (
            <div 
                className="div-container" style={this.style()}
                onClick={this.reload}
            >
                <svg style={this.iconStyle()} width="24" height="24" viewBox="0 0 24 24" fill='none' xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 13C20 17.4183 16.4183 21 12 21C7.58172 21 4 17.4183 4 13C4 8.58172 7.58172 5 12 5C13.4571 5 14.8233 5.38958 16 6.07026L13.5 8.5H18.5L19 3L17.5 4.5" stroke={colors.ButtonFontColor} stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
        )
    }
}

/**
 * 命令输入框
 */
window.KtReactComponents.CmdInputter = class KtCmdInputter extends React.Component {
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

    async onEnterClick(e) {
        if (e.key == "Enter" && this.isInputing) {
            // this.InputDom.blur();
            const inputValue = this.inputRef.current.value;
            this.inputRef.current.value = "";
            // 清空输出的内容
            this.outputRef.current.value = "";
            
            const res = await ktf.Cmd(inputValue)
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
        const colors = window.KtReactComponents.getThemeColors()
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
        const colors = window.KtReactComponents.getThemeColors()
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
                    <img src="../utils/res/images/cat-sit.gif" alt="" />
                </div>

                <audio ref={this.clickAudioRef} src="../utils/res/audios/click.mp3"></audio>
            </div>
        )
    }
}

/**
 * 给便利贴用的占据全屏的textArea
 */

window.KtReactComponents.NoteTextarea = class KtNoteTextarea extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            content: ''
        }

        this.noteRef = React.createRef()

        // 输入的时候隔几秒就要自动保存一次
        this.AUTO_SAVE_TIME_GAP = 5; // n秒
        this.autoSaveInterval = null
    }

    async componentDidMount() {
        const res = await kt.DbGet({
            key: 'noteContent'
        })
        if (res.status !== 2000) {
            console.log(res)
            alert('发生错误辣~建议备份该页笔记后，关闭窗口重开')
            return 
        }
        if (res.value === undefined) {
            this.noteRef.current.value = '' // 初次打开窗口
            this.syncData()
        } else {
            this.noteRef.current.value = res.value
        }

        // 注册textarea事件
        this.noteRef.current.addEventListener('blur', async () => {
            clearInterval(this.autoSaveInterval)
            this.syncData()
        })

        this.noteRef.current.addEventListener('focus', async () => {
            clearInterval(this.autoSaveInterval)
            this.autoSaveInterval = setInterval(async () => {
                this.syncData()
            }, this.AUTO_SAVE_TIME_GAP * 1000)
        })
    }

    // 同步本地笔记内容到远程
    async syncData() {
        const syncRes = await kt.DbSet({
            key: 'noteContent',
            value: this.noteRef.current.value
        })

        if (syncRes.status !== 2000) {
            alert('发生错误辣~建议备份该页笔记后，关闭窗口重开')
            return
        }

        // sync done
    }

    textareaStyle() {
        return {
            fontFamily: "JiangCheng",
            width: '100%',
            height: '96%',
            padding: '0 10px 0 10px',
            border: 'none'
        }
    }

    style() {
        return {
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
        }
    }

    render() {
        return (
            <div style={this.style()}>
                <textarea
                    style={this.textareaStyle()} 
                    className='kt-good-textarea-1' 
                    ref={this.noteRef}
                ></textarea>
            </div>
        )
    }
}