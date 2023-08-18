const { DragBar, WindowFrame, GlobalHandler } = window.fmComponents

class FMRoot extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isShow: false,
            showStatus: 'hide',
            isGettingSelected: false, 

            windowLeft: 0,
            windowRight: 0,
            windowWidth: 200,
            windowHeight: 300,

            dragedText: ''
        }
    }

    async componentDidMount() {
        // 发起唤醒执行
        fm.on.windowWake(async (e, args) => {
            await this.doShow()
        })

        this.doHide()
    }

    // 设置位置
    async setPos() {
        const cursorPoint = (await fm.agent.getSelected()).cursorPoint
        const screenInfo = (await fm.eScreen.getDisplayMatching({
            params: [{
                x: cursorPoint.x,
                y: cursorPoint.y,
                width: 1,
                height: 1
            }]
        })).result

        await fm.window.setRect({
            x: screenInfo.bounds.x,
            y: screenInfo.bounds.y,
            width: screenInfo.bounds.width,
            height: screenInfo.bounds.height,
        })

        // 计算框框位置
        let windowLeft = cursorPoint.x - screenInfo.bounds.x
        let windowTop = cursorPoint.y - screenInfo.bounds.y
        if (windowLeft >= screenInfo.bounds.width - this.state.windowWidth * 1.1) {
            windowLeft = cursorPoint.x - this.state.windowWidth
        }
        if (windowTop >= screenInfo.bounds.height - this.state.windowHeight * 1.1) {
            windowTop = cursorPoint.y - this.state.windowHeight
        }

        this.setState({
            windowLeft: windowLeft,
            windowTop: windowTop,
        })

    }

    // ========== show hide ==========
    async doShow() {
        if (this.state.showStatus !== 'hide') return
        // 取消鼠标无视
        await fm.eWindow.__call({
            functionName: 'setIgnoreMouseEvents',
            params: [false]
        })
        await this.setPos()
        await fm.window.show()
        // 获取拖黑的内容
        
        this.setState({
            isShow: true,
            showStatus: 'showing',
            isGettingSelected: true,
            dragedText: '正在获取选中内容...'
        }, () => {
            // 这里只是为了留一个缓冲区，没太大作用
            setTimeout(async () => {
                this.setState({
                    showStatus: 'show',
                })
            }, 0)
        })
        setTimeout(async () => {
            let dragedText = (await fm.agent.getSelected()).text
            this.setState({
                dragedText: dragedText,
                isGettingSelected: false
            })
        }, 520)
    }
    async doHide() {
        if (this.state.showStatus !== 'show') return
        // 无视所有鼠标操作
        await fm.eWindow.__call({
            functionName: 'setIgnoreMouseEvents',
            params: [true]
        })
        this.setState({
            isShow: false,
            showStatus: 'hidding'
        }, async () => {
            setTimeout(async () => {
                this.setState({
                    showStatus: 'hide'
                })
                await fm.window.hide()
            }, 300)
        })
    }

    async clickMask() {
        await this.doHide()
    }

    // ========= 功能操作 ==========
    // 打开浏览器搜索
    async BrowserSearch(e, webSite, content) {
        e.stopPropagation()
        await fm.agent.openBrowserSearch({
            webSite: webSite,
            content: content
        })
        this.clickMask();
    }

    render() {
        return (
            <div style={{
                backgroundColor: '#eeeeee00',
                height: '100vh',
                width: '100vw',
                overflow: 'hidden',
                display: 'flex',
                pointerEvents: `${this.state.showStatus === 'show' ? 'auto': 'none'}`,

            }} onClick={() => {this.clickMask()}}>
                <GlobalHandler/>
                <div style={{
                    position: 'absolute',
                    left: this.state.windowLeft,
                    top: this.state.windowTop,
                    width: `${this.state.windowWidth}px`,
                    height: `${this.state.windowHeight}px`,
                    backgroundColor: '#fff',
                    border: '1px solid #feea83',
                    borderRadius: '10px 10px 10px 10px',
                    opacity: `${this.state.isShow? 1 : 0}`,
                    padding: '10px 10px 10px 10px',
                    display: 'flex',
                    flexDirection: 'column',
                    flexWrap: 'wrap',
                    alignItems: 'flex-start',
                    justifyContent: 'flex-start',
                    animationDuration: '0.3s'
                }} onClick={(e) => {e.stopPropagation()} }
                className={`sunshine-box-shadow animate__animated ${this.state.isShow? 'animate__fadeIn' : 'animate__fadeOut'}`}>
                    <div style={{
                        width: '100%',
                        maxHeight: '60px',
                        lineHeight: '17px',
                        fontSize: '12px',
                        overflow: 'hidden',
                        wordBreak: 'break-word',
                        // borderBottom: '1px solid #f30ba4',
                        padding: '0 0 10px 0',
                        display: 'flex',
                        flexWrap: 'no-wrap',
                        textOverflow: 'ellipsis'
                    }}>
                        🤫 {this.state.dragedText}
                    </div>

                    <div style={{
                        width: '100%',
                        height: '1px',
                        backgroundColor: '#639bff',
                        boxShadow: '1px 1px 8px #639bff'
                    }}></div>

                    <div style={{
                        width: '100%',
                        flexGrow: 1
                    }}>
                        <div className="search-button hvr-forward" onClick={(e) => {
                            this.BrowserSearch(e, 'baidu', this.state.dragedText)
                        }}>
                            👉百度一下
                        </div>
                        <div className="search-button hvr-forward" onClick={(e) => {
                            this.BrowserSearch(e, 'zhihu', this.state.dragedText)
                        }}>
                            👉知乎搜索
                        </div>
                        <div className="search-button hvr-forward" onClick={(e) => {
                            this.BrowserSearch(e, 'bilibili', this.state.dragedText)
                        }}>
                            👉Bilibili搜索
                        </div>
                    </div>

                    <div style={{
                        width: '100%',
                        fontSize: '8px',
                        display: 'flex',
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                        cursor: 'default'
                    }}>
                        <img src="./favicon.ico" width='20px' height="20px" />鱼昕草™工作室. All Rights Reserved.
                    </div>
                </div>
            </div>
        )
    }
}

ReactDOM.render(<FMRoot />, document.getElementById('root'))