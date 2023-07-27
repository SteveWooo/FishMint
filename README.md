# KTool
完全用户定制化的PC桌面挂件平台🐟

在该平台上，只要你能运用基本的前端技术，即可彻底定制、修改你的专属PC桌面挂件

一切都是纯纯的Web

## 快速开始
- 进入 https://github.com/SteveWooo/KTool/releases 下载对应平台的压缩包，解压，双击KTool.exe启动
- 在命令框输入 "/help" 即可查看帮助
- 比如输入 "/open note" 即可启动一个便利贴
- 托盘区右键即可找到退出按钮

## 获取本项目挂件库
进入程序目录，将KTool目录删除，然后克隆本项目到原本KTool的位置即可。

## 开发文档

挂件本质上运行在一个Chromium窗口上，所以所有开发内容本质上和一个h5没区别，本平台仅做了3点干预：
- 根据config.json，做一些预先配置。比如是否有frame、是否启动开发者工具、是否背景透明、是否记录窗口Rect属性等；
- 全局多了一个window.kt实例，用于调用内核实现的接口；
- 窗口的url后有一个__wid参数，window.kt上的接口都需要提交该参数；

### app配置(config.json)

app配置代表初次启动app的时候需要载入的属性，以下用控制台的配置文件做示范
```json
{
    "configure": {
        "x": 100, // 窗口初始位置与宽高
        "y": 100, 
        "width": 330,
        "height": 220,
        // 下面几个同步electron的BrowserWindow创建参数。详见https://www.electronjs.org/zh/docs/latest/api/browser-window
        "type": "toolbar",
        "frame": false,
        "resizable": true,
        "transparent": true,
        "hasShadow": true,
        "alwaysOnTop": false,

        "kt_devTools": false, // 是否启动开发者工具
        "kt_isolateSession": true, // 是否使用独立的session空间
    }
}
```

### kt接口

kt实例挂载在全局window上，可以从note和控制台应用中了解具体DEMO用法。，以下是每个接口的参数说明

#### __wid
wid是窗口唯一识别码，每次交互都需要，该参数在url上可获取到

#### 通用调用方式、通用参数
接口调用方式如下，注意 __wid 每次都需要传递
```js
let res = await kt.blablabla({
    __wid: $WID_FROM_URL,
    ...others // 其他参数
})
```
通用返回信息:
```js
{
    status: 2000, // 错误码，非2000都是有问题
    message: '', // 错误信息
    ...others // 其他参数
}
```

#### OpenApp
打开一个新的app

参数：
- appDirName: KTool目录下的app目录，比如note

#### CloseWindow
关闭当前窗口

参数：
- __wid: 窗口唯一识别码

#### DbSet
给当前窗口存储一个key，窗口被关闭后，数据将会被删除（控制台app除外）

参数：
- __wid: 窗口唯一识别码
- key: 字段key
- value: 字段value

#### DbGet
获取当前窗口存储的key

参数：
- __wid: 窗口唯一识别码
- key: 字段key

返回：
- status: 状态码
- message: 错误信息
- value: 字段value

#### SetWindowRect
设置当前窗口的位置、宽高

参数：
- __wid: 窗口唯一识别码
- x: x坐标
- y: y坐标，相对于屏幕左上角为原点
- width: 窗口宽
- height: 窗口高

#### GetWindowInfo
获取当前窗口的信息

参数：
- __wid: 窗口唯一识别码

返回示例：
暂略

#### 其他接口尚待补充

## 免责声明
本项目内提供的所有软件与资料均遵循本项目开源协议内容，基于本平台二次开发应用的责任均有开发者自行承担，望开发者知悉

