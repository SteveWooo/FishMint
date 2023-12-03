<h2 align="center">FishMint</h2>
<div align="center">
  <img src="./favicon.ico" width="120" height="120" />
  <br />
  <b>超个性化PC桌面挂件制作引擎</b>
  <br />
</div>

## 关于
FishMint 是一个桌面挂件开发工具，你可以一边使用本项目开源的挂件，一边使用 Html JS CSS 来构建你的桌面挂件，同时也能使用 NodeJS 技术栈写业务逻辑。

FishMint 是基于 Electron 开发的一个工具，专注于桌面挂件、小工具、美化桌面、美丽废物的开发，如果你正在寻找一些能快速搭建桌面小应用的平台，请考虑使用 FishMint。

## 💻环境要求
Windows

目前正在完善 MacOS 版本

## ‍快速开始

- 下载基座：进入 [下载页面](https://github.com/SteveWooo/FishMint/releases) 
- 按下 Alt+` 即可召唤出控制面板
- 进入挂件库后，将你想要的挂件拖出桌面即可使用
- 进入工坊后，你可以尽情创作、修改你的挂件应用
- 托盘区图标右击可以对挂件进程进行管理

## ♥获取本项目最新挂件库
进入程序目录，将 FishMint 目录删除，然后克隆本项目到原本 FishMint 的位置即可。

## 开机启动
各个系统开机自启方式很多，指向程序包解压出来的可执行程序 FishMint.exe 即可。以下是windows的开机自启步骤：

- win+r，输入：shell:startup
- 创建一个快捷方式，指向程序包的可执行程序
- 后续如果有新包，修改快捷方式的指向，指向新包的可执行程序即可。

## 开发文档
### 1、创建一个app

通过热键（默认alt + `）打开欢迎页面，点击“工坊”，进入工坊后，点击左下角的 “创建挂件应用”，选择一个模板，其中blank模板为纯净的web应用，Demo则是带了react cdn版的应用。

### 2、fm api

fm实例挂载在全局window上，可以通过文档查看使用方法，也可以通过查看__core应用写法来了解用法

#### 通用调用方式
基座内核接口调用示例如下
```js
let res = await fm.window.getInfo()
// ==> log res
```
#### [详细接口文档](https://stevewooo.github.io/FishMint)

## 分享你的应用

将应用文件夹拷贝给你的朋友使用即可，比如想分享note应用，就将本项目的note目录整个拷贝出去即可。

注意安全问题，切勿乱放入陌生人写的应用。

欢迎提pr贡献app

## 数据&配置
所有应用产生的数据，都在软件目录的 'userData' 目录中，用户可自行备份。

所有数据，都在这里，我们除了开机启动这个功能外，不会动你的用户目录。

文件夹名称作为应用唯一ID，请注意解决冲突问题。

## 免责声明
本项目内提供的所有软件与资料均遵循本项目开源协议内容，基于本平台二次开发应用的责任均有开发者自行承担，望开发者知悉

## 依赖

本项目目前依赖了以下第三方开源项目：

- 基本：electron、electron-builder、express
- 网络：axios、request、bonjour
- 系统、数据库：systeminformation、LevelDB、robotjs、node-corn
- 密码学：secp256k1
- 前端：react、babel、elementUI、animation.css、hover.css
- 实用工具：monent
- IDE：monaco
- AI：transformer.js

以上均为MIT或Apache2.0协议，基座未对源码进行修改。

## License
MIT
