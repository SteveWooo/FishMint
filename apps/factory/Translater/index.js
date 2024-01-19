const { DragBar, WindowFrame, GlobalHandler } = window.fmComponents

class FMRoot extends React.Component {
    constructor(props) {
        super(props)
    }

    async componentDidMount() {
        
    }

    render() {
        return (
            <WindowFrame 
            closeButton={true} 
            pinButton={true} 
            closeWarn={false}
            minimizeButton={true}>
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
                    <iframe width="100%" height="99%" style={{
                        zoom: 0.2
                    }} src="https://fanyi.youdao.com/index.html#/"></iframe> 
                </div>
            </WindowFrame>
        )
    }
}

ReactDOM.render(<FMRoot />, document.getElementById('root'))