# 微信小程序轻量级组件化开发助手(类库)

[![mp-helper](https://img.shields.io/npm/v/mp-helper.svg?style=flat-square)](https://www.npmjs.com/package/mp-helper)

MP Helper 不是一个框架，而是基于小程序原生 MINA 框架的开发助手与语法增强类库

### 特性

- 使用 `.mp` 单文件页面组件化开发，内聚且耦合
- 支持 `require` `import` 直接引入 npm 包依赖

### 特点

- 轻量易用，低侵入性，低学习成本
- 不改变小程序原生 MINA 框架的语法，同时支持原生写法
- 编译时不会对 js 语法进行转译 （因此请开启微信开发者工具的 `ES6 转 ES5` `增强编译` 功能）

### TODO

- `API` 语法增强，新增 `computed` 等能力
- 命令行 `CLI`：图片支持压缩
- 命令行 `CLI`：`<config>` 支持 js 语法


## 快速上手

安装

```bash
$ npm i -S mp-helper
```

### 配置 CLI

在项目中 `package.json` 文件字段 `scripts` 配置

```js
/* package.json */
"scripts": {
  "dev": "mp-helper -w src dist",
  "build": "mp-helper src dist"
}
```

- `src` 为输入路径
- `dist` 为输出路径
- 使用 `npm run dev` 命令开发
- 使用 `npm run build` 命令构建

至此即可使用 `.mp` 单文件规范进行开发

此外，还可配置[微信开发者工具 - 自定义预处理功能](https://developers.weixin.qq.com/miniprogram/dev/devtools/debug.html#自定义预处理)

> 使用时需开启: 详情 - 启用自定义处理命令

```js
/* project.config.json */
"scripts": {
  "beforePreview": "npm run build",
  "beforeUpload": "npm run build"
}
```

### 引入工具库

```html
<!-- .mp -->
<script>
import mp from 'mp-helper';
// ...
</script>
```

> `mp-helper` CLI 在解析 `.mp` 文件时会自动处理引入的 npm 包依赖


---

## `.mp` 单文件

#### 模板

开发时可参考文件模板：
- [app.mp](./templates/app.mp)
- [page.mp](./templates/page.mp)
- [component.mp](./templates/component.mp)

#### 例子

这是一个文件名为 `index.mp` 的简单实例：

```html
<config>
{
    "navigationBarBackgroundColor": "#ffffff",
    "navigationBarTextStyle": "black",
    "navigationBarTitleText": "演示页面",
    "backgroundColor": "#eeeeee",
    "backgroundTextStyle": "light"
}
</config>

<template>
<view class="container">
    <button wx:if="{{ !userInfo }}" bind:tap="tapButton">按钮</button>
    <block wx:else>
        <image src="{{ userInfo.avatarUrl }}"></image>
        <text class="nickname">{{ userInfo.nickName }}</text>
    </block>
</view>
</template>

<script>
// 若想使用对原生 App/Page/Component 对象进行增强的语法
// 可引入 mp-helper API 代替进行注册小程序/页面/组件
//   App -> mp.App
//   Page -> mp.Page
//   Component -> mp.Component
import mp from 'mp-helper';

mp.Page({ 
    data: {
        userInfo: null
    },
    tapButton() {
        this.setData({
            userInfo: {
                avatarUrl: '',
                nickName: '昵称',
            }
        });
    }
});
</script>

<style lang="less">
.container {
    background: #fff;
}
</style>
```


#### 语法

页面 `index.mp` 文件聚合了

| 标签 | 编译分离 | 属性 |
|:--- |:--- |:--- |
| 页面配置 `config` | 生成 [index.json](https://developers.weixin.qq.com/miniprogram/dev/reference/configuration/page.html) | `lang` 可选值为 `json`，默认值为 `json` |
| 页面模板 `template` | 生成 [index.wxml](https://developers.weixin.qq.com/miniprogram/dev/framework/quickstart/code.html#WXML-模板) | `lang` 可选值为 `wxml`，默认值为 `wxml` |
| 页面逻辑 `script` | 生成 [index.js](https://developers.weixin.qq.com/miniprogram/dev/framework/quickstart/code.html#JS-逻辑交互) | `lang` 可选值为 `js`/`javascript`，默认值为 `js` |
| 页面样式 `style` | 生成 [index.wxss](https://developers.weixin.qq.com/miniprogram/dev/framework/quickstart/code.html#WXSS-样式) | `lang` 可选值为 `less`、`wxss`，默认值为 `wxss` |


#### 解析编译

利用 `mp-helper` 命令行可完成对 `.mp` 文件的解析与编译：

```
Usage: mp-helper [options] <input...> <output>

Options:
  -w, --watch            监听文件变化
  -c, --config <config>  高级配置模式 (默认读取 ./package.json)
  -v, --version          output the version number
  -h, --help             output usage information

Arguments:
  <input>   输入路径 (Globs 规则)
  <output>  输出路径

Examples:
# 纯命令行模式
$ mp-helper ./src ./dist
$ mp-helper -w ./src ./dist
$ mp-helper "src/**.mp" ./dist
# 高级配置模式 (读取 ./package.json `mp-helper` 字段)
$ mp-helper -c
$ mp-helper -c -w
```

**配置模式：** 在文件 `package.json` 进行配置的例子

```js
{
    // ...
    "mp-helper": {
        // io 输入输出 支持配置多个
        "io": [
            {
                "input": "./input",
                "output": "./output"
            },
            {
                "input": ["./src/**.mp", "./static"],
                "output": "./dist"
            }
        ],
        // 是否开启监听 默认 false
        "watch": false,
        // 是否清理 output 文件夹 默认 false
        "clean": false,
        // 是否提取依赖 默认 true
        "extractDeps": true
    }
}
```


## 增强 API

### mp.App(`options`)

`options` 支持所有的 [原生 App 参数](https://developers.weixin.qq.com/miniprogram/dev/reference/api/App.html)，此外新增了：


### mp.Page(`options`)

`options` 支持所有的 [原生 Page 参数](https://developers.weixin.qq.com/miniprogram/dev/reference/api/Page.html)，此外新增了：


### mp.Component(`options`)

`options` 支持所有的 [原生 Component 参数](https://developers.weixin.qq.com/miniprogram/dev/reference/api/Component.html)，此外新增了：

