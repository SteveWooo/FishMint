const { DragBar, WindowFrame, GlobalHandler } = window.fmComponents
const { HashRouter, Route, Routes, Link } = window.ReactRouterDOM;
const { Switch, TextField, Select, MenuItem, Snackbar, FormControl, styled } = window.MaterialUI

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
const CutSelect = styled(Select)(({ theme }) => ({
    width: '100px',
    height: '40px',
    fontSize: '14px'
}));

class FMGeneralPage extends React.Component {
    constructor(p) {
        super(p)
        this.state = {
            HotUpdate: false,
            ACCEKERATORS: {
                MODIFIERS: [],
                KEY_CODES: []
            },
            toastIsDoneSyncConfigure: false,
            toastNotDoneSyncConfigure: false,
            hotKey1: '',
            hotKey2: '',
            i18n: []
        }
    }

    async componentDidMount() {
        const config = (await fm.configure.get()).configure
        const constRes = await fm.const()
        const hotkeyController = config.HotKeyController.split('+')
        let hotKey1 = ''
        let hotKey2 = ''

        if (hotkeyController.length === 1) {
            if (constRes.const.GLOBAL_SHORTCUT_ACCELERATORS.MODIFIERS.includes(hotkeyController[0])) {
                hotKey1 = hotkeyController[0]
            }
            if (constRes.const.GLOBAL_SHORTCUT_ACCELERATORS.KEY_CODES.includes(hotkeyController[0])) {
                hotKey2 = hotkeyController[0]
            }
        }
        if (hotkeyController.length > 1) {
            if (constRes.const.GLOBAL_SHORTCUT_ACCELERATORS.MODIFIERS.includes(hotkeyController[0])) {
                hotKey1 = hotkeyController[0]
            }
            if (constRes.const.GLOBAL_SHORTCUT_ACCELERATORS.KEY_CODES.includes(hotkeyController[1])) {
                hotKey2 = hotkeyController[1]
            }
        }


        this.setState({
            i18n: constRes.i18n,
            ACCEKERATORS: constRes.const.GLOBAL_SHORTCUT_ACCELERATORS,
            HotUpdate: config.HotUpdate,
            hotKey1: hotKey1,
            hotKey2: hotKey2,
        })
    }

    async onChangeHotKey1(e) {
        this.setState({
            hotKey1: e.target.value
        }, () => {
            this.syncHotKey()
        })
    }

    async onChangeHotKey2(e) {
        this.setState({
            hotKey2: e.target.value
        }, () => {
            this.syncHotKey()
        })

    }
    // 拼接
    async syncHotKey() {
        const { hotKey1, hotKey2 } = this.state
        let HotKeyController = ''
        if (hotKey1 !== 'null' && hotKey2 !== 'null') {
            HotKeyController = [hotKey1, hotKey2].join('+')
        }
        if (hotKey1 === 'null' && hotKey2 !== 'null') {
            HotKeyController = hotKey2
        }
        if (hotKey1 !== 'null' && hotKey2 === 'null') {
            HotKeyController = hotKey1
        }
        const res = await fm.configure.set({
            key: 'HotKeyController',
            value: HotKeyController
        })
        if (res.status !== 2000) {
            this.setState({
                toastNotDoneSyncConfigureMessage: res.message,
                toastNotDoneSyncConfigure: true
            })
        } else {
            this.setState({
                toastIsDoneSyncConfigure: true
            })
        }
    }

    render() {
        return (
            <div style={{
                width: '100%',
            }}>
                <div className='setting-item-group'>
                    {/* 热更新 */}
                    <div className="setting-item">
                        <div style={{
                            width: '25%',
                            height: '50px',
                        }} className="setting-item-content">
                            {this.state.i18n['capp-hotUpdate']}
                        </div>
                        <div style={{
                            width: '75%',
                            height: '50px',
                        }} className="setting-item-content">
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

                    {/* 热键设置 */}
                    <div className="setting-item">
                        <div style={{
                            width: '25%',
                            height: '50px'
                        }} className="setting-item-content">
                            {this.state.i18n['capp-hotKeyActiveController']}
                        </div>
                        <div style={{
                            width: '75%',
                            height: '50px',
                            display: 'flex',
                            flexDirection: 'row'
                        }} className="setting-item-content">
                            {/* <FormControl > */}
                            {/* hotKey - 1 */}
                            <CutSelect
                                color='warning'
                                // label={this.state.i18n['capp-hotKey1']}
                                value={this.state.hotKey1}
                                onChange={(e) => {
                                    this.onChangeHotKey1(e)
                                }}
                            >
                                {
                                    this.state.ACCEKERATORS.MODIFIERS.map(r => {
                                        return (
                                            <MenuItem value={r}>
                                                {r}
                                            </MenuItem>
                                        )
                                    })
                                }
                            </CutSelect>
                            {/* hotKey - 2 */}
                            <CutSelect
                                color='warning'
                                // label={this.state.i18n['capp-hotKey2']}
                                value={this.state.hotKey2}
                                onChange={(e) => {
                                    this.onChangeHotKey2(e)
                                }}
                            >
                                {
                                    this.state.ACCEKERATORS.KEY_CODES.map(r => {
                                        return (
                                            <MenuItem value={r}>
                                                {r}
                                            </MenuItem>
                                        )
                                    })
                                }
                            </CutSelect>
                            {/* </FormControl> */}
                        </div>
                    </div>


                    {/* 提示配置已同步的 Toast */}
                    <Snackbar
                        anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "right"
                        }}
                        open={this.state.toastIsDoneSyncConfigure}
                        autoHideDuration={1500}
                        onClose={(event, reason) => {
                            if (reason === 'clickaway') {
                                return;
                            }
                            this.setState({
                                toastIsDoneSyncConfigure: false
                            })
                        }}
                        message={`${this.state.i18n['capp-doneSyncConfigure']}`}
                    />

                    {/* 提示同步失败的Toast */}
                    <Snackbar
                        anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "right"
                        }}
                        open={this.state.toastNotDoneSyncConfigure}
                        autoHideDuration={1500}
                        onClose={(event, reason) => {
                            if (reason === 'clickaway') {
                                return;
                            }
                            this.setState({
                                toastNotDoneSyncConfigure: false
                            })
                        }}
                        message={`${this.state.toastNotDoneSyncConfigureMessage}`}
                    />
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