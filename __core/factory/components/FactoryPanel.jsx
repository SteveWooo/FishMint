const { DragBar, WindowFrame, GlobalHandler } = window.fmComponents

class FactoryPanel extends React.Component {
    constructor(p) {
        super(p)
    }

    render() {
        const appInfo = this.props.currentAppInfo
        return (
            <div>
                factory panel {appInfo.appDirName}
            </div>
        )
    }
}