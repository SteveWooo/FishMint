const { DragBar, WindowFrame, GlobalHandler } = window.fmComponents
const { Button } = window.MaterialUI

class FMRoot extends React.Component {
    constructor(props) {
        super(props)
    }

    async componentDidMount() {
        // this.dnkngwchj()
    }

    async dnkngwchj() {
        await fm.robotjs.__call({
            functionName: 'moveMouse',
            params: [350, 1270]
        })
        await fmSdk.sleep(500)
        await fm.robotjs.__call({
            functionName: 'mouseClick'
        })
        await fmSdk.sleep(500)

        for (let i = 0; i < 3; i++) {
            // await fm.robotjs.__call({
            //     functionName: 'typeString',
            //     params: ['wdnkngwchj']
            // })
            // await fm.robotjs.__call({
            //     functionName: 'keyTap',
            //     params: ['enter']
            // })
        }

    }

    render() {
        return (
            <WindowFrame closeButton={true}>
                <GlobalHandler />
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignContent: 'center',
                    width: '100%',
                    height: '100%'
                }}>
                    <Button color="warning" onClick={() => { this.dnkngwchj() }}>
                        wdnkngwchj
                    </Button>
                </div>
            </WindowFrame>
        )
    }
}

ReactDOM.render(<FMRoot />, document.getElementById('root'))