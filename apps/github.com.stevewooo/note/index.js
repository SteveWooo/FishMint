const { DragBar, CmdInputter, GlobalHandler, WindowFrame } = window.fmComponents

/**
 * 给便利贴用的占据全屏的textArea
 */
class NoteTextarea extends React.Component {
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
        const res = await fm.db.get({
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
            this.noteRef.current.style.overflow = 'hidden'
            clearInterval(this.autoSaveInterval)
            this.syncData()
        })

        this.noteRef.current.addEventListener('focus', async () => {
            this.noteRef.current.style.overflow = 'auto'
            clearInterval(this.autoSaveInterval)
            this.autoSaveInterval = setInterval(async () => {
                this.syncData()
            }, this.AUTO_SAVE_TIME_GAP * 1000)
        })
    }

    // 同步本地笔记内容到远程
    async syncData() {
        const syncRes = await fm.db.set({
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
            padding: '5px 15px 5px 15px',
            border: 'none'
        }
    }

    style() {
        return {
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
        }
    }

    render() {
        return (
            <div style={this.style()}>
                <textarea
                    spellCheck={false}
                    style={this.textareaStyle()}
                    className='kt-good-textarea-1'
                    ref={this.noteRef}
                ></textarea>
            </div>
        )
    }
}

class FMRoot extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}

        // 可以在这里指定下主题色
        window.fmComponents.usingTheme = 'dba'
    }

    // getStyle() {
    //     const colors = window.fmComponents.getThemeColors()
    //     return {
    //         height: '99vh',
    //         borderBottom: '2px solid ' + colors.WindowBorderColor,
    //         borderLeft: '2px solid ' + colors.WindowBorderColor,
    //         borderRight: '2px solid ' + colors.WindowBorderColor,
    //         // borderTop: '2px solid ' + colors.WindowBorderColor,
    //         borderRadius: '13px 0px 10px 10px',
    //         display: 'flex',
    //         flexDirection: 'column',
    //         flexWrap: 'wrap',
    //         alignItems: 'flex-start',
    //         fontFamily: 'JiangCheng',
    //         backgroundColor: colors.WindowBackgroundColor,
    //     }
    // }

    contentStyle() {
        return {
            width: '100%',
            height: '98%',
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'row',
            alignItems: 'center'
        }
    }

    render() {
        return (
            <WindowFrame 
                closeButton={true}
                closeWarn={true}
                minimizeButton={false}
                pinButton={true}>
                <GlobalHandler hotUpdate={window.fmComponents.doHotUpdate} />
                <div style={this.contentStyle()}
                    className='div-container'>
                    <NoteTextarea />
                </div>
            </WindowFrame>
        )
    }
}
ReactDOM.render(<FMRoot />, document.getElementById("root"))