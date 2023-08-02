const { DragBar, CmdInputter } = window.KtReactComponents

class KtRoot extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    getStyle() {
        const colors = window.KtReactComponents.themes[window.KtReactComponents.usingTheme]
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

    contentStyle() {
        return {
            // backgroundColor: '#fff',
            width: '100%',
            flexGrow: 1,

            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            alignItems: 'center'
        }
    }

    render() {
        return (
            <div style={this.getStyle()}>
                <DragBar></DragBar>
                <div style={this.contentStyle()}
                    className='div-container'>
                    <CmdInputter />
                </div>
            </div>
        )
    }
}
ReactDOM.render(<KtRoot />, document.getElementById("root"))

// 热更新
kt.on.staticFileChange(async (event, args) => {
    // location.reload()
})

// setTimeout(async () => {
//     await kt.WindowBrocast({
//         content: {
//             hello: 'windows'
//         }
//     })
// }, 500)