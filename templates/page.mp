<config lang="json">
{
    "navigationBarTitleText": "页面"
}
</config>

<template>
<view class="container">

</view>
</template>

<script>
import mp from 'mp-helper';
// 注册 Page
mp.Page({
    // 上下文数据 store (mp-helper 增强API)
    // 将注入到当前页面及其所有组件的 data.$context 内, 跨页面不共享
    // 通过 this.$setContext 设置页面上下文数据使页面响应, 用法与一致 setData
    $context: {

    },

    // 页面响应数据
    data: {

    },

    /* 生命周期 */
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

    /* Others */

    /* Methods */

});
</script>

<style lang="less">
.container {

}
</style>
