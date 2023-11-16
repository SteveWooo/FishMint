const { DragBar, WindowFrame, GlobalHandler } = window.fmComponents
const { Input, Button } = window.MaterialUI

class FMRoot extends React.Component {
    constructor(props) {
        super(props)
        this.langRef = React.createRef()
        this.promptRef = React.createRef()
    }

    componentDidMount() {
       
    }

    async submit() {
        // const lang = this.langRef.current.value
        const prompt = this.promptRef.current.value
        const res = await fm.net.http.request({
            url: 'http://192.168.0.108:1080',
            method: 'POST',
            headers: {
                'Content-Type': 'Application/json'
            },
            body: JSON.stringify({
                // lang: "JavaScript",
                lang: 'JavaScript',
                prompt: prompt,
            })
        })

        console.log(res.json.response)

        const html = res.json.response[0]

        document.write(html)
    }

    inputStyle() {
        return {
            width: '100%',
            height: '100px',
            fontSize: '16px',
            padding: '10px',
            border: 'none',
            outline: 'none',
            resize: 'none',
            overflow: 'hidden'
        }
    }

    render() {   
        return (
            <WindowFrame>
                <GlobalHandler />
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexWrap: 'wrap',   
                    width: '100%',
                    flexGrow: 1
                }}> 
                123
                     {/* <input style={this.inputStyle()} ref={this.langRef} value="JavaScript" placeholder="lang" /> */}
                     <textarea style={this.inputStyle()} ref={this.promptRef} value="用html css js，写一个页面，背景是白色，有一个h1标签，内容是hello world" placeholder="prompt" />
                     <Button onClick={() => {this.submit()}}>Submit</Button>
                </div>
            </WindowFrame>
        )
    }
}

ReactDOM.render(<FMRoot />, document.getElementById('root'))