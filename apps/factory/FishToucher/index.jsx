const { DragBar, WindowFrame, GlobalHandler } = window.fmComponents
const { TextField, Button } = window.MaterialUI

const FISH_STATUS = {
    NORMAL: 'normal',
    HAPPY: 'happy' 
}
const EVENT_TYPE = {
    // 鱼的状态
    STTAUS_CHANGE: 'statusChange',

    // p2p发来的事件
    FISH_HAPPY: 'fishHappy',
}

class Fish extends React.Component {
    constructor(p) {
        super(p)

        this.state = {
            fishStatus: FISH_STATUS.NORMAL,
        }

        // 数据记录
        this.moveData = {
            eventHappyDistance: 500, // 触发事件
            lastmovePos: undefined, // 用来记录move总轨迹
            distance: 0
        }

        this.fishRef = React.createRef()
    }

    async componentDidMount() {

    }

    // ========== 处理鼠标事件 ==========
    async onMouseEnterFish(e) {
        this.moveData.lastmovePos = {
            x: e.pageX,
            y: e.pageY
        }
    }
    async onMouseLeaveFish(e) {
        this.moveData.lastmovePos = undefined
        this.moveData.distance = 0
    }
    async onMouseMoveFish(e) {
        const pos = {
            x: e.pageX,
            y: e.pageY
        }

        if (this.moveData.lastmovePos === undefined) return
        const distance = Math.sqrt(
            Math.pow(pos.x - this.moveData.lastmovePos.x, 2) + 
            Math.pow(pos.y - this.moveData.lastmovePos.y, 2)
        )
        this.moveData.lastmovePos.x = pos.x;
        this.moveData.lastmovePos.y = pos.y;
        this.moveData.distance += distance
        if (this.moveData.distance >= this.moveData.eventHappyDistance) {
            this.eventHappy()
        }
    }

    // ========== 状态触发 ==========
    async eventHappy() {
        if (this.state.fishStatus !== FISH_STATUS.NORMAL) {
            return 
        }
        this.setState({
            fishStatus: FISH_STATUS.HAPPY
        }, () => {
            this.props.onFishEvent && this.props.onFishEvent({
                type: EVENT_TYPE.STTAUS_CHANGE,
                fishStatus: FISH_STATUS.HAPPY
            })
        })

        // 临时的
        setTimeout(() => {
            this.setState({
                fishStatus: FISH_STATUS.NORMAL
            })
        }, 1000)
    }

    // ========== 通讯接口 ==========
    async onPeerEvent(data) {
        if (data.type === EVENT_TYPE.FISH_HAPPY) {
            this.eventHappy()
        }
    }

    render() {
        return (
            <div>
                <div ref={this.fishRef} style={{
                    width: '100px',
                    height: '100px',
                }} onMouseEnter={e => this.onMouseEnterFish(e)}
                    onMouseMove={e => this.onMouseMoveFish(e)}
                    onMouseLeave={e => this.onMouseLeaveFish(e)}>
                    <img style={{
                        width: '100%',
                        height: '100%'
                    }} src="./favicon.ico" className={`animate__animated ${
                        this.state.fishStatus === FISH_STATUS.HAPPY ? 'animate__bounce' : ''
                    }`} />
                </div>
            </div>
        )
    }
}

class FMRoot extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            inputtingTargetPeerID: '',
            peerID: ''
        }

        this.peer = null
        // 保存所有连接
        this.conns = []

        this.fishRef = React.createRef()
    }

    async componentDidMount() {
        const peer = new Peer({
            host: '0.peerjs.com',
            port: 443,
            config: {

            }
        })
        peer.on('open', async (id) => {
            this.peer = peer;
            this.setState({
                peerID: id
            })
        })

        // 管理被连接
        peer.on('connection', async conn => {
            this.conns.push(conn)
            conn.on('data', data => {
                this.handleReceiveData(conn, data)
            })
            conn.on('close', () => {
                console.log('on connection close')
                // TODO
            })
        })
    }

    async doConn() {
        const conn = this.peer.connect(this.state.inputtingTargetPeerID)
        conn.on('open', () => {
            this.conns.push(conn)
        })
        conn.on('data', data => {
            this.handleReceiveData(conn, data)
        })
        conn.on('close', () => {
            // TODO
        })
    }

    // 管理接受的数据
    async handleReceiveData(conn, data) {
        if (data.type === EVENT_TYPE.FISH_HAPPY) {
            this.fishRef.current.onPeerEvent({
                type: EVENT_TYPE.FISH_HAPPY
            })
        }   
    }

    // 广播
    async brocast(e) {
        const msg = {
            ...e
        }
        for(let i = 0; i < this.conns.length; i++) {
            this.conns[i].send(msg)
        }
    }

    // 鱼的通讯接口
    async onFishEvent(e) {
        if (e.type === EVENT_TYPE.STTAUS_CHANGE) {
            if (e.fishStatus === FISH_STATUS.HAPPY) {
                this.brocast({
                    type: EVENT_TYPE.FISH_HAPPY,
                    fishStatus: e.fishStatus,
                })
            }
        }
    }

    render() {
        return (
            <WindowFrame closeButton={true}>
                <GlobalHandler />
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    alignContent: 'flex-start',
                    flexDirection: 'column',
                    flexWrap: 'wrap',
                    width: '100%',
                    height: '100%'
                }}>
                    <div style={{
                        width: '100%',
                        fontSize: '10px'
                    }}>
                        peerID: {this.state.peerID === '' ? 'loading....' : this.state.peerID}
                    </div>

                    <div style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center'
                    }}>
                        <TextField
                            size='small'
                            value={this.state.inputtingTargetPeerID}
                            onChange={(e) => {
                                this.setState({
                                    inputtingTargetPeerID: e.target.value
                                })
                            }} />
                        <Button
                            size='small'
                            onClick={() => {
                                this.doConn()
                            }}>
                            conn
                        </Button>
                    </div>

                    {/* 摸鱼 */}
                    <div style={{
                        width: '100%',
                        flexGrow: 1,
                        display: 'flex',
                        justifyContent: 'center',
                        alignContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Fish ref={this.fishRef} onFishEvent={(e) => {
                            this.onFishEvent(e)
                        }} />
                    </div>
                </div>
            </WindowFrame>
        )
    }
}

ReactDOM.render(<FMRoot />, document.getElementById('root'))