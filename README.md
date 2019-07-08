# 微信小程序轻量型开发助手/增强类库

[![mp-helper](https://img.shields.io/npm/v/mp-helper.svg?style=flat-square)](https://www.npmjs.com/package/mp-helper)
[![CHANGELOG](https://img.shields.io/badge/CHANGELOG-yellow.svg?style=flat-square)](https://github.com/mcc108/mp-helper/releases)

MP Helper 不是一个框架，而是基于小程序原生 MINA 框架的开发助手与语法增强类库

### 特性

- 使用 `.mp` 单文件页面组件化开发，内聚且耦合
- 支持 `require` `import` 直接引入 npm 包依赖
- `API` 语法增强，新增数据状态管理 `store` `context`、事件管理 `emitter`、计算属性 `computed` 等能力
- 拓展工具集，包含小程序原生方法 Promise 化 `promiser` 、类名属性连接 `classNames`、行内样式连接 `inlineStyles` 等方法

### 特点

- 轻量易用，低侵入性，低学习成本
- 不改变小程序原生 MINA 框架的语法与用法习惯
- 编译时不会对 js 语法进行转译 （因此请开启微信开发者工具的 `ES6 转 ES5` `增强编译` 功能）
- 小程序基础库最低要求 v2.6.1

### TODO

- 命令行 `CLI`：图片支持压缩


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

### 引入类库 Core

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
- 注册小程序 [app.mp](./templates/app.mp)
- 注册页面 [page.mp](./templates/page.mp)
- 注册页面 (组件化页面) [component-page.mp](./templates/component-page.mp)
- 注册组件 [component.mp](./templates/component.mp)

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
| 页面配置 `config` | 生成 [index.json](https://developers.weixin.qq.com/miniprogram/dev/reference/configuration/page.html) | `lang` 可选值为 `json` `js`，默认值为 `json` |
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

> **约定：** 为了与小程序原生API进行区别，在注册 App/Page/Component 方法内新增的属性与方法名前会加上 `$`

### mp.App(`options`)

`options` 支持所有的 [原生 App 参数](https://developers.weixin.qq.com/miniprogram/dev/reference/api/App.html)，此外新增了：

```js
mp.App({
    $store,
})
```

#### 构造属性 `$store`


用于存储全局数据，将注入到所有页面与组件的 `data.$store` 内, 因此需慎重存储重要的数据

在 App/Page/Component 内都可通过 `this.$setStore` 实例方法设置全局数据使页面响应, 用法与一致 `this.setData`

需注意的是，在 Component 内只能在 `attached` 生命周期后获取 `this.data.$store`、调用 `this.$setStore`

> 在低于 v2.7.4 的版本中 `$store` 不可用用于组件的 `$computed` 或 `observers`，兼容低版本需使用 `_store`
> 
> 原因为：[组件 observers 属性无法监听以 $ 开头的属性名](https://developers.weixin.qq.com/community/develop/doc/000ee441ef0ba08da8c8fe33f55400?jumpto=reply&parent_commentid=00086253c309e8efa7c884d6d51c&commentid=00088eba7e014871b2c81f4f8500)

### mp.Page(`options`)

`options` 支持所有的 [原生 Page 参数](https://developers.weixin.qq.com/miniprogram/dev/reference/api/Page.html)，此外新增了：

```js
mp.Page({
    $context,
})
```

> 若想将页面以自定义组件形式构造，可参见官方提供的方法 [使用 Component 构造器构造页面](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/component.html#使用-Component-构造器构造页面)
> 
> 此情况需使用 `mp.Component` 进行注册页面，且页面配置需添加 `"usingComponents": {}`，模板可见 [component-page.mp](./templates/component-page.mp)

Page 中可使用 `this.$app` 方法获取 app 实例

#### 构造属性 `$context`

用于存储当前页面上下文数据，将注入到当前页面及其所有组件的 `data.$context` 内, 跨页面不共享

在 Page/Component 内都可通过 `this.$setContext` 实例方法设置当前页面上下文数据使页面响应, 用法与一致 `this.setData`

需注意的是，在 Component 内只能在 `ready` 生命周期后获取 `this.data.$context`、调用 `this.$setContext`

> 在低于 v2.7.4 的版本中 `$context` 不可用用于组件的 `$computed` 或 `observers`，兼容低版本需使用 `_context`
> 
> 原因为：[组件 observers 属性无法监听以 $ 开头的属性名](https://developers.weixin.qq.com/community/develop/doc/000ee441ef0ba08da8c8fe33f55400?jumpto=reply&parent_commentid=00086253c309e8efa7c884d6d51c&commentid=00088eba7e014871b2c81f4f8500)

### mp.Component(`options`)

`options` 支持所有的 [原生 Component 参数](https://developers.weixin.qq.com/miniprogram/dev/reference/api/Component.html)，此外新增了：

```js
mp.Component({
    $computed,
})
```

Component 中可使用 `this.$app` 方法获取 app 实例。在 `attached` 生命周期后，可使用 `this.$page` 方法获取所在 page 实例

#### 构造属性 `$computed`

```js
$computed: {
    total: {
        depend: ['list'], // 即 this.data.list
        get(list) {
            return list.length;
        }
    },
    showList: {
        depend: ['total', 'loading'], // 即 computed total (this.data.total) 和 this.data.loading
        get(total, loading) {
            return total && !loading;
        }
    },
}
```

此处需通过 `depend` 声明当前计算属性所用到的依赖数据（在 `this.data` 中的 `path`），取值会作为参数传入 `get` 方法中，实际上可以理解为是 [小程序组件 observers](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/observer.html) 的语法糖

计算属性最终将会注入至 `this.data` 内


### 路由

在 Page/Component 内都可通过 `this.$route` 实例属性获取当前的路由信息


### 事件监听

- 全局事件监听（四种方式）：
  - `mp.on()`
  - App 实例方法: `this.$on()`
  - Page 实例方法: `this.$app.$on()`
  - Component 实例方法: `this.$app.$on()`
- 单个当前页面内的事件监听：
  - Page 实例方法: `this.$on()`
  - Component 实例方法: `this.$page.$on()`

#### on(`type`, `handler`)

- `type`: String 要侦听的事件名称
- `handler`: Function 事件响应函数

注册事件监听

#### off(`type`, `handler`)

- `type`: String 要取消的事件名称
- `handler`: Function 其事件响应函数

取消事件侦听

#### emit(`type`, `...args`)

- `type`: String 要取消的事件名称
- `...args`: 传入事件响应函数的参数

触发事件


### 工具库 mp.utils

```js
const {
    promiser,
    classNames,
    inlineStyles,
    urlString,
} = mp.utils;
```

#### promiser(`nativeMethod`)

- `nativeMethod`: 原生小程序 API 方法
- 返回: 转换为 `Promise` 后的方法

将原生方法转换为 `Promise` 方法，其中 `success` 属性转换为 `resolve`、`fail` 属性转换为 `reject`

```js
// 例子
const login = promiser(wx.login);
const res = await login();
```


#### classNames(`...`)

- 参数: 见 [JedWatson/classnames](https://github.com/JedWatson/classnames)
- 返回: `class` 字符串

类名属性连接工具，将数组、对象等形式 `class` 转换为字符串，详见 [classnames](https://github.com/JedWatson/classnames)


#### inlineStyles(`styleObject`)

- `styleObject`: 对象形式 style
- 返回: `style` 字符串

样式属性连接工具，将对象形式 `style` 转换为行内字符串


#### urlString.stringify(`url`, `query`)

- `url`: 基础 URL 字符串
- `query`: 查询值参数对象，支持复杂 JSON 对象
- 返回: 完整字符串形式 URL

拼接页面地址工具，将 URL 与查询值参数信息拼接


#### urlString.parse(`urlstring`)

- `urlstring`: 字符串形式 URL
- 返回: 解析后包含 `url` `query` 的对象

解析页面地址工具，将字符串形式 URL 转换为对象形式

> **工具库中内置的第三方工具：**
> 
> #### mitt
> 
> 事件管理器，即 [mitt](https://github.com/developit/mitt)
> 
> #### urlString.qs
> 
> URL `querystring` 查询值解析工具，即 [qs](https://github.com/ljharb/qs)

