# 微信小程序轻量级组件化开发助手(库)

### 特性

- `.mp` 单文件页面/组件，组件化内聚且耦合

### 特点

- 不改变小程序原生 MINA 框架的语法，轻量易用，低侵入性，低学习成本
- 编译时不会对 js 语法进行转译 （因此请开启微信开发者工具的 `ES6 转 ES5` `增强编译` 功能）

### TODO

- 语法增强，新增 `computed` 等
- 压缩图片

## `.mp` 单文件

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
Page({
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


#### 编译

执行 `mp-helper` 命令可完成 `.mp` 文件的解析与编译：

```
Usage: mp-helper [options] <input> <output>

Options:
  -w, --watch    监听文件变化
  -v, --version  output the version number
  -h, --help     output usage information

Arguments:
  <input>   输入路径 (Globs 规则)
  <output>  输出路径

Examples:
$ mp-helper ./src ./dist
$ mp-helper -w ./src ./dist
$ mp-helper "src/**.mp" ./dist
```

