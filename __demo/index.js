const { DragBar, WindowFrame, GlobalHandler } = window.KtReactComponents

class KtRoot extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <WindowFrame>
                <GlobalHandler hotUpdate={true} />
                <DragBar />
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    flexGrow: 1
                }}>
                    Hello 
                </div>
            </WindowFrame>
        )
    }
}

ReactDOM.render(<KtRoot />, document.getElementById('root'))