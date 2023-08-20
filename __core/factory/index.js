const { DragBar, WindowFrame, GlobalHandler } = window.fmComponents

class AppList extends React.Component {
    constructor(p) {
        super(p)
    }

    render() {
        return (
            <div style={{
                height: '100%',
                width: '100%',
                // borderRight: '1px solid #dcc'
            }}>
                app list
            </div>
        )
    }
}

class FactoryPanel extends React.Component {
    constructor(p) {
        super(p)
    }

    render() {
        return (
            <div>
                factory panel
            </div>
        )
    }
}

class FMRoot extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            router: 'welcome', 
        }
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
                            alignItems: 'center',
                            color: 'transparent',
                            textShadow: '0px 0px 1px #111, 1px 1px 2px #111111dd'
                        }}>
                            <img src="./favicon.ico" style={{
                                width: '40px',
                                height: '40px',
                                marginRight: '10px',
                            }} /> FishMint 工坊
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
                            <AppList />
                        </div>

                        {/* 操作面板 */}
                        <div style={{
                            width: '80%',
                            height: '100%',
                            backgroundColor: '#5f5f5f'
                        }}>
                            <FactoryPanel />
                        </div>
                    </div>
                </div>
            </WindowFrame>
        )
    }
}

ReactDOM.render(<FMRoot />, document.getElementById('root'))