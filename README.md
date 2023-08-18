# <div align="center">FishMint</div>

<div align="center">
  <img src="./favicon.ico" width="120" height="120" />
  <br />
  <b>超个性化PC桌面挂件制作引擎</b>
  <br />
</div>

## ‍快速开始

- 下载基座：进入 [下载页面](https://github.com/SteveWooo/FishMint/releases) 解压，双击可执行程序即可启动基座
- 按下 Alt+` 即可召唤出控制面板
- 进入挂件库后，将你想要的挂件拖出桌面即可使用
- 右键挂件界面，可以退出挂件、或进入挂件的源码目录，尽情修改
- 托盘区图标，右击也可以对挂件进程进行管理

## ♥获取本项目最新挂件库
进入程序目录，将 FishMint 目录删除，然后克隆本项目到原本 FishMint 的位置即可。

## 开机启动
因为 ~~懒了~~ 尽量不想动你的注册表，外加担心你写的工程会因为基座版本发生诡异的冲突，所以自动更新、开机启动功能就不集成到内核了

各个系统开机自启方式很多，指向程序包解压出来的可执行程序 FishMint 即可。以下是windows的开机自启步骤：

- win+r，输入：shell:startup
- 创建一个快捷方式，指向程序包的可执行程序
- 后续如果有新包，修改快捷方式的指向，指向新包的可执行程序即可。

## 开发文档
### 1、创建一个app

在apps目录下找到demo目录，整个目录复制一份，就完成app的创建辣

[config.json 配置项说明](https://stevewooo.github.io/FishMint/global.html#WindowConfigure)

### 2、fm api

fm实例挂载在全局window上，可以从note和控制台应用中了解具体DEMO用法，以下是通用用法与接口文档

#### 通用调用方式
基座内核接口调用示例如下
```js
let res = await fm.window.getInfo()
// ==> log res
```
#### [详细接口文档](https://stevewooo.github.io/FishMint)

## 分享你的应用

将应用文件夹拷贝给你的朋友使用即可，比如想分享note应用，就将本项目的note目录整个拷贝出去即可。

注意安全问题，早期切勿乱放入陌生人写的应用。

欢迎提pr贡献app

## 生态&兼容

FishMint 目前坚持 Web3 理念，不做中心化的生态：包括插件商城、统一云存储等，我们希望每个挂件都是自己 + AI 做给自己用，FishMint 只是在保留开发灵活的基础上，提供让大部分人能迅速做一个 PC 挂件的能力。

将来会以买断制方式出售专业版 FishMint 基座；并可以商讨定制化需求，交付更安全的基座与定制化挂件、服务器等。

相关社区中挂件的兼容方式：
- 在index.html中，请规范地引入css与js文件。FishMint 没有破坏浏览器原生加载模式。
- config.json 中给窗口配置属性的字段是 browserWindowOptions。而且 FishMint 禁止配置 webPreferences，请参考 [config.json configure 配置项说明](https://stevewooo.github.io/FishMint/global.html#WindowConfigure) 文档进行相关功能的配置
- 需要参考 fm 接口进行相关修改，FishMint的 windows 上只额外挂载了一个对象，叫fm。
- 定制交付版中，preload.js 将不会整合 nodejs 环境。

## 数据&配置
所有应用产生的数据，都在软件目录的 'userData' 目录中，用户可自行备份。

文件夹名称作为应用唯一ID，请注意解决冲突问题

## 免责声明
本项目内提供的所有软件与资料均遵循本项目开源协议内容，基于本平台二次开发应用的责任均有开发者自行承担，望开发者知悉

## 依赖

本项目目前依赖了以下第三方开源项目：

- 基本：electron、electron-builder、express
- 网络：axios、request
- 系统、数据库：systeminformation、LevelDB、robotjs、node-corn
- 密码学：secp256k1
- 前端：react、babel、elementUI、animation.css、hover.css
- 实用工具：monent

以上均为MIT或Apache2.0协议，基座未对源码进行修改

## License
MIT

基座将在开发完善到一定程度后开源
