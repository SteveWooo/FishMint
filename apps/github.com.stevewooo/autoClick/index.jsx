const { DragBar, WindowFrame, GlobalHandler } = window.fmComponents

class FMRoot extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            attacking: false
        }

        this.attackInterval = null
    }

    async doAttack() {
        // fm.robotjs.__call({ functionName: 'moveMouse', params: [900, 900] }).then(r => console.log(r))
        fm.robotjs.__call({ functionName: 'mouseClick' }).then()
    }

    async startAttack() {
        this.setState({
            attacking: true
        })
        this.attackInterval = setInterval(() => {
            this.doAttack()
        }, 10000)
    }

    async stopAttack() {
        this.setState({
            attacking: false
        })
        clearInterval(this.attackInterval)
    }

    async componentDidMount() {
        
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
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    width: '100%',
                    height: '100%'
                }}>
                    {
                        !this.state.attacking && (
                            <button onClick={() => {this.startAttack()}}>
                                attack
                            </button>
                        )
                    }
                    {
                        this.state.attacking && (
                            <button onClick={() => {this.stopAttack()}}>
                                stop attack
                            </button>
                        )
                    }
                </div>
            </WindowFrame>
        )
    }
}

ReactDOM.render(<FMRoot />, document.getElementById('root'))