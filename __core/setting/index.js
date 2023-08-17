const { DragBar, WindowFrame, GlobalHandler } = window.fmComponents
const { HashRouter, Route, Routes, Link } = window.ReactRouterDOM;
const { Switch, styled } = window.MaterialUI

const Android12Switch = styled(Switch)(({ theme }) => ({
    padding: 8,
    '& .MuiSwitch-track': {
        borderRadius: 22 / 2,
        '&:before, &:after': {
            content: '""',
            position: 'absolute',
            top: '50%',
            transform: 'translateY(-50%)',
            width: 16,
            height: 16,
        },
        '&:before': {
            backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
                theme.palette.getContrastText(theme.palette.primary.main),
            )}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
            left: 12,
        },
        '&:after': {
            backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
                theme.palette.getContrastText(theme.palette.primary.main),
            )}" d="M19,13H5V11H19V13Z" /></svg>')`,
            right: 12,
        },
    },
    '& .MuiSwitch-thumb': {
        boxShadow: 'none',
        width: 16,
        height: 16,
        margin: 2,
    },
}));

class FMGeneralPage extends React.Component {
    constructor(p) {
        super(p)
        this.state = {
            HotUpdate: false
        }
    }

    async componentDidMount() {
        const config = (await fm.configure.get()).configure
        this.setState({
            HotUpdate: config.HotUpdate
        })
    }

    render() {
        return (
            <div style={{
                width: '100%'
            }}>
                <div style={{
                    width: '100%',
                    color: '#333',
                    fontSize: '16px',
                    display: 'flex',
                    justifyContent: 'flex-start',
                    flexDirection: 'row',
                    alignItems: 'center',
                    flexWrap: 'wrap'
                }}>
                    <div style={{
                        width: '25%'
                    }}>
                        应用热更新
                    </div>
                    <div style={{
                        width: '75%'
                    }}>
                        <Android12Switch
                            checked={this.state.HotUpdate}
                            color="warning"
                            onChange={async (e) => {
                                this.setState({
                                    HotUpdate: e.target.checked
                                })
                                await fm.configure.set({
                                    key: 'HotUpdate',
                                    value: e.target.checked
                                })
                            }} />
                    </div>
                </div>
            </div>
        )
    }
}

class FMRoot extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            baseName: ''
        }
    }

    async componentDidMount() {
        const windowInfo = await fm.window.getInfo()
        const CONST = await fm.const()
        const appDirName = windowInfo.configure.appDirName
        this.setState({
            baseName: CONST.STATIC_APP_PATH + "/" + appDirName
        })
    }

    async applyConfigure() {

    }

    render() {
        return (
            <WindowFrame closeWarn={false} closeButton={true}>
                <GlobalHandler />
                <HashRouter>
                    <div style={{
                        width: '90%',
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'flex-start',
                        padding: '0px 5% 0px 5%'
                    }}>
                        {/* 导航栏 */}
                        <nav style={{
                            width: '100%',
                            height: 'auto',
                        }}>
                            <a href="#/" className={`hvr-grow 
                            ${location.hash === '#/' ? 'active-link' : ''
                                }`}>常规</a>
                        </nav>

                        {/* 内容页 */}
                        <div style={{
                            marginTop: '20px',
                            width: '100%'
                        }}>
                            <Route exact path="/" component={FMGeneralPage} />
                        </div>
                    </div>
                </HashRouter>
            </WindowFrame>
        )
    }
}

ReactDOM.render(<FMRoot />, document.getElementById('root'))