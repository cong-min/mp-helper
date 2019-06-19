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
    <button wx:if="{{ !userInfo && true }}" bind:tap="tapButton">按钮</button>
    <block wx:else>
        <image src="{{ userInfo.avatarUrl }}"></image>
        <text class="nickname">{{ userInfo.nickName }}</text>
    </block>
</view>
</template>

<script>
import dayjs from 'dayjs';
import README from './README.txt';
const uniq = require('lodash/uniq');
// 注册 APP
App({
    // 页面数据
    data: {
        userInfo: null
    },

    /* 生命周期 */
    // 页面加载
    onLoad(options) {},
    // 页面切入显示
    onShow(options) {},
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
    // 转发分享 (定义了此事件，右上角菜单将显示 转发 按钮)
    //onShareAppMessage(event) {},
    // 当前是 Tab 页时，点击 Tab 项
    //onTabItemTap(item) {},

    /* Methods */
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

<style>
.container {
    color: #000;
}
</style>
