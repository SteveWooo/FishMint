const { DragBar, WindowFrame, GlobalHandler } = window.fmComponents

class FMRoot extends React.Component {
    constructor(props) {
        super(props)
        this.config = {
            width: 128,
            height: 128
        }
    }

    async componentDidMount() {
        let that = this;
        const dragBox = document.getElementById("dragBox")
        dragBox.ondragover = (e) => { e.preventDefault(); }
        dragBox.ondrop = (e) => {
            e.preventDefault()

            // 处理压缩
            const tempCanvas = document.getElementById('tempCanvas')
            const ctx = tempCanvas.getContext('2d')
            const fr = new FileReader()
            fr.readAsDataURL(e.dataTransfer.files[0])
            const fileData = e.dataTransfer.files[0]
            
            fr.onload = function () {
                const img = new Image()
                img.onload = () => {
                    ctx.clearRect(0, 0, that.config.width, that.config.height)
                    ctx.drawImage(img, 0, 0, that.config.width, that.config.height)
                    const canvasDataUrl = tempCanvas.toDataURL('image/png')
                    // 创建一个下载链接
                    var downloadLink = document.getElementById("downloadLink");
                    downloadLink.href = canvasDataUrl;
                    downloadLink.download = fileData.name.replace('.png', '.compressed.png');
                    // 模拟点击下载链接
                    downloadLink.click();
                }
                img.src = this.result
            }
        }
    }

    render() {
        return (
            <WindowFrame closeButton={true}
                pinButton={true}
                closeWarn={false}
                minimizeButton={true}
            >
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
                    <h4>PNG Compress to {this.config.width}</h4>
                    <div id="dragBox" style={{
                        width: '100%',
                        display: 'flex',
                        height: '80px',
                        border: '1px solid #eee',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        drag here
                    </div>
                    <canvas id="tempCanvas" width={this.config.width} height={this.config.height} style={{
                        display: 'none'
                    }} />
                    <a id="downloadLink" style={{
                        display: 'none'
                    }} />
                </div>
            </WindowFrame>
        )
    }
}

ReactDOM.render(<FMRoot />, document.getElementById('root'))