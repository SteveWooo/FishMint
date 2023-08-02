const { DragBar, CmdInputter, NoteTextarea } = window.KtReactComponents

class KtRoot extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}

        // 可以在这里指定下主题色
    }

    getStyle() {
        const colors = window.KtReactComponents.getThemeColors()
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
            flexDirection: 'row',
            alignItems: 'center'
        }
    }

    render() {
        return (
            <div style={this.getStyle()}>
                <DragBar></DragBar>
                <div style={this.contentStyle()}
                    className='div-container'>
                    <NoteTextarea/>
                </div>
            </div>
        )
    }
}
ReactDOM.render(<KtRoot />, document.getElementById("root"))

// 热更新

kt.on.staticFileChange(() => {
    location.reload()
})
kt.on.windowBrocast((e, data) => {
    // console.log(data.content)
})

// kt.OnWindowBrocast((e, data)=> {
//     console.log(data)
// })
// kt.eScreen.getPrimaryDisplay().then(r => {
//     console.log(r)
// })