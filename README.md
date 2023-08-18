# <div align="center">FishMint</div>

<div align="center">
  <img src="./favicon.ico" width="120" height="120" />
  <br />
  <b>超个性化PC桌面挂件制作平台</b>
  <br />
</div>

## ‍快速开始
这个项目基于 browserWindow 概念，让您的桌面挂件风格、功能均能基于 Web 技术栈自由搭建。每一个桌面挂件都源于开源，为您带来随心所欲的创作乐趣，让您的桌面焕发个性光彩！

- 下载基座：进入 [下载页面](https://github.com/SteveWooo/FishMint/releases) 解压，双击可执行程序即可启动基座
- 在弹出界面的框框输入 "/help" ，回车，即可查看帮助
- 比如输入 "/open note" 即可启动一个便利贴

  👆Tips：Which is 启动了本项目的note工程
- 关闭主窗口，程序会藏在托盘区。右击图标，即可找到退出按钮

## ♥获取本项目最新挂件库
进入程序目录，将 FishMint 目录删除，然后克隆本项目到原本 FishMint 的位置即可。

## 开机启动
因为 ~~懒了~~ 尽量不想动你的注册表，外加担心你写的工程会因为基座版本发生诡异的冲突，所以自动更新、开机启动功能就不集成到内核了

各个系统开机自启方式很多，指向程序包解压出来的可执行程序 FishMint 即可。以下是windows的开机自启步骤：

- win+r，输入：shell:startup
- 创建一个快捷方式，指向程序包的可执行程序
- 后续如果有新包，修改快捷方式的指向，指向新包的可执行程序即可。

## 开发文档

挂件本质上运行在一个Chromium窗口上，所以所有开发内容本质上和一个h5没区别，本平台仅对BrowserWindow做了以下干涉：
- 根据config.json，做一些预先配置。比如是否有frame、是否启动开发者工具、是否背景透明、是否记录窗口Rect属性等；
- 全局多了一个window.kt实例，用于调用基座内核实现的接口、事件订阅等；
- 禁止跳转；

### 0、创建一个app

本项目中，utils、docs文件夹外的都是app，可以通过open指令、fm.OpenApp接口来启动。开发者创建一个新的App步骤如下

- 创建一个文件夹，命名为你想要的app名称；
- 在上述文件夹中创建config.json和index.html文件；
- config.json下段介绍；index.html就是你的页面辣。

### 1、app配置(config.json)

用于在打开app窗口的时候传入的初始配置

[配置项说明](https://stevewooo.github.io/FishMint/global.html#WindowConfigure)

### 2、kt api

kt实例挂载在全局window上，可以从note和控制台应用中了解具体DEMO用法，以下是通用用法与接口文档

#### 通用调用方式
基座内核接口调用示例如下
```js
let res = await fm.GetWindowInfo({})
// ==> log res
```
#### [详细接口文档](https://stevewooo.github.io/FishMint)

## 分享你的应用

将应用文件夹拷贝给你的朋友使用即可，比如想分享note应用，就将本项目的note目录整个拷贝出去即可。

注意安全问题，早期切勿乱放入陌生人写的应用。

欢迎提pr贡献app

## 数据&配置
所有应用产生的数据，都在软件目录的 'userData' 目录中，用户可自行备份。

文件夹名称作为应用唯一ID，请注意解决冲突问题

## 免责声明
本项目内提供的所有软件与资料均遵循本项目开源协议内容，基于本平台二次开发应用的责任均有开发者自行承担，望开发者知悉

## 依赖

基座依赖以下第三方开源项目：

electron、electron-builder、express、axios、react、systeminformation、LevelDB、monent

以上均为MIT或Apache2.0协议，基座未对源码进行修改

## License
MIT

基座将在开发完善到一定程度后开源
