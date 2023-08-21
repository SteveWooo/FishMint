const { DragBar, WindowFrame, GlobalHandler } = window.fmComponents

class FactoryPanel extends React.Component {
    constructor(p) {
        super(p)
        this.state = {
            currentAppInfo: null,
            appConfig: null
        }
    }

    async componentDidMount() {
        
    }

    async updateAppInfo() {
        const currentAppInfo = this.props.currentAppInfo
        const appConfig = await fm.controller.getAppConfig({
            appDirName: currentAppInfo.appDirName
        })
        this.setState({
            currentAppInfo: currentAppInfo,
            appConfig: appConfig
        })
        console.log(appConfig)
    }

    async componentDidUpdate(prevProps) {
        if (this.props.currentAppInfo !== prevProps.currentAppInfo) {
            this.updateAppInfo()
        }
    }

    render() {
        return (
            <div>
                {/* 欢迎页 */}
                {!this.state.currentAppInfo && (
                    <div className="welcome">
                        welcome
                    </div>
                )}
                
                {/* app操作页面 */}
                {this.state.currentAppInfo && (
                    <div>
                        factory panel {this.state.currentAppInfo && this.state.currentAppInfo.appDirName}
                    </div>
                )}
            </div>
        )
    }
}