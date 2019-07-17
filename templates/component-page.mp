<config lang="json">
{
    "navigationBarTitleText": "组件化页面",
    "usingComponents": {}
}
</config>

<template>
<view class="container page">

</view>
</template>

<script>
import mp from 'mp-helper';
// 注册页面 (使用 Component 构造组件化页面)
// https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/component.html#使用-Component-构造器构造页面
mp.Component({
    // 配置项
    options: {
        addGlobalClass: true, // 支持全局样式
    },

    // 上下文数据 context (mp-helper 增强API)
    // 将注入到当前页面及其所有组件的 data.$context 内, 跨页面不共享
    // 通过 this.$setContext 设置页面上下文数据使页面响应, 用法与一致 setData
    $context: {

    },

    // 内部数据
    data: {

    },
    // 计算数据 (mp-helper 增强API)
    $computed: {

    },
    // 数据字段监听
    observers: {},

    /* Methods */
    methods: {
        /* 页面生命周期 */
        // 页面加载
        onLoad(query) {},
        // 页面切入显示
        onShow() {},
        // 页面渲染完成
        onReady() {},
        // 页面隐藏
        onHide() {},
        // 页面卸载
        onUnload() {},

        /* 页面事件 */
        // 下拉刷新
        //onPullDownRefresh() {},
        // 上拉触底
        //onReachBottom() {},
        // 页面滚动
        //onPageScroll(event) {},
        // 页面尺寸改变
        //onResize() {},
        // 转发分享 (定义了此事件，右上角菜单将显示`转发`按钮)
        //onShareAppMessage(event) {},
        // 当前是 Tab 页时，点击 Tab 项
        //onTabItemTap(item) {},

        /* Other Methods */

    }
});
</script>

<style lang="less">
.page {

}
</style>
