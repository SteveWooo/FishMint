const { DragBar, WindowFrame, GlobalHandler } = window.fmComponents
const { Input, Button } = window.MaterialUI

class FMRoot extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            chatInputValue: '',
            apiKeyValue: '',
            router: 'init', // init、chat,
            waitting: false,
            record: [], // 聊天记录对象存放处
        }

        this.MAX_RECORD = 6;

        this.outputRef = React.createRef()
    }

    async componentDidMount() {
        const apiKey = await fm.db.get({
            key: 'openaiKey',
            field: 'app'
        })
        if (apiKey.value !== undefined) {
            this.doLogin()
            return
        }

        // 未登录
        this.setState({
            router: 'init'
        })
    }

    async doLogin() {
        // 已登录，加载本地记录
        const recordData = await fm.db.get({
            key: 'openaiRecord',
            field: 'window'
        })
        if (recordData.value === undefined) {
            await fm.db.set({
                key: 'openaiRecord',
                field: 'window',
                value: []
            })
        }
        this.setState({
            router: 'chat',
            record: recordData.value || []
        }, () => {
            this.scrollToBottom() 
        })
        return
    }

    // 滚动到底部
    scrollToBottom() {
        this.outputRef.current && 
            (this.outputRef.current.scrollTop = this.outputRef.current.scrollHeight)
    }

    // 按下回车的事件
    async onSubmitChat() {
        if (this.state.chatInputValue === '') return
        if (this.state.waitting) return

        this.scrollToBottom()

        const content = this.state.chatInputValue
        const recordTemp = this.state.record
        recordTemp.push({
            'role': 'user',
            'content': content
        })
        this.setState({
            waitting: true,
            chatInputValue: '',
            record: recordTemp
        }, () => {
            this.scrollToBottom()
        })

        // do ask
        const res = await fm.net.http.request({
            method: 'post',
            url: 'https://api.openai.com/v1/chat/completions',
            headers: {
                'Content-Type': 'Application/json',
                'Authorization': `Bearer ${(await fm.db.get({ key: 'openaiKey', field: 'app' })).value}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [{
                    role: 'user',
                    content: content,
                }],
                max_tokens: 512
            }),
            proxy: 'http://127.0.0.1:1081'
        })

        // 处理返回结果
        this.setState({
            waitting: false,
        }, () => {
            this.scrollToBottom()
        })
        console.log(res)
        if (res.status !== 2000 || res.httpStatusCode !== 200) {
            await fm.dialog.showErrorBox({
                message: res.message
            })
            return
        }

        // 返回成功
        if (Array.isArray(res.json.choices)) {
            const responseMessage = res.json.choices[0].message.content
            // 更新聊天记录
            let record = this.state.record
            record.push({
                'role': 'assistant',
                'content': responseMessage
            })
            if (record.length >= this.MAX_RECORD) {
                record = record.splice(record.length - this.MAX_RECORD)
            }

            await fm.db.set({
                key: 'openaiRecord',
                value: record
            })

            this.setState({
                record: record
            }, () => {
                this.scrollToBottom()
            })

            return
        }

        await fm.dialog.showErrorBox({
            message: res.result.error
        })
    }

    // 输入界面中登录
    async onSubmitApiKey() {
        const apiKey = this.state.apiKeyValue
        await fm.db.set({
            key: 'openaiKey',
            field: 'app',
            value: apiKey
        })
        this.doLogin()
    }

    render() {
        const colors = window.fmComponents.getThemeColors()
        return (
            <WindowFrame>
                <GlobalHandler hotUpdate={window.fmComponents.doHotUpdate} />

                {/* 聊天 */}
                {
                    this.state.router === 'chat' ? (
                        <div style={{
                            width: '99%',
                            height: '100%',
                            display: 'flex',
                            justifyContent: 'flex-end',
                            flexDirection: 'column',
                            alignItems: 'flex-end',
                        }}>
                            <div style={{
                                width: '100%',
                                overflowY: 'auto',
                                overflowX: 'hidden',
                                // flexGrow: 1,
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'flex-start',
                                alignItems: 'flex-start',
                                flexWrap: 'wrap',
                                
                            }} ref={this.outputRef} className="better-scroll">
                                {
                                    this.state.record.map(r => {
                                        return (
                                            <div style={{
                                                width: '100%',
                                                paddingRight: '10px',
                                                fontSize: '10px',
                                                display: 'flex',
                                                flexWrap: 'wrap',
                                                wordWrap: 'break-word',
                                                // borderTop: '1px solid #666'
                                                // display: 'flex',
                                                // flexWrap: 'wrap',
                                                // justifyContent: 'flex-start'
                                            }}>
                                                {r.role}: {r.content}
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            <div style={{
                                width: '100%',
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'center'
                            }}>
                                <Input
                                    style={{
                                        width: '90%',
                                        marginLeft: '0%',
                                        marginBottom: '10px',
                                        height: '30px',
                                        fontSize: '12px',
                                    }}
                                    placeholder={this.state.waitting ? 'waiiting...' : 'Send a message'}
                                    value={this.state.chatInputValue}
                                    onChange={e => {
                                        if (this.state.waitting) return 
                                        this.setState({
                                            chatInputValue: e.target.value
                                        })
                                    }}
                                    onKeyPress={(e) => { e.key === 'Enter' && this.onSubmitChat() }} />
                            </div>
                        </div>
                    ) : null
                }

                {/* 登录 */}
                {
                    this.state.router === 'init' ? (
                        <div style={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            flexWrap: 'wrap'
                        }}>
                            <Input
                                style={{
                                    width: '90%'
                                }}
                                value={this.state.apiKeyValue}
                                onChange={e => {
                                    if (this.state.waitting) return 
                                    this.setState({
                                        apiKeyValue: e.target.value
                                    })
                                }}
                                onKeyPress={(e) => { e.key === 'Enter' && this.onSubmitApiKey() }} />
                            <Button style={{
                                width: '100%',
                                marginTop: '10px',
                                color: colors.ItemFontColor
                            }} onClick={() => {
                                this.onSubmitApiKey()
                            }}>
                                login
                            </Button>
                        </div>
                    ) : null
                }
            </WindowFrame>
        )
    }
}

ReactDOM.render(<FMRoot />, document.getElementById('root'))