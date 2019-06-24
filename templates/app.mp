<config lang="json">
{
    "pages": [
    ],
    "window": {
        "backgroundColor": "#F6F6F6",
        "backgroundTextStyle": "light",
        "navigationBarBackgroundColor": "#F6F6F6",
        "navigationBarTitleText": "小程序",
        "navigationBarTextStyle": "black"
    }
}
</config>

<script>
import mp from 'mp-helper';
// 注册 App
mp.App({
    // 全局数据 store (mp-helper 增强API)
    // 将注入到所有页面/组件的 data.$store 内, 慎重存储重要数据
    // 通过 this.$setStore 设置全局数据可使页面响应, 用法与一致 setData
    $store: {

    },

    /* 生命周期 */
    // 小程序初始化完成时触发，全局只触发一次
    onLaunch(options) {},
    // 小程序启动，或从后台进入前台显示时触发
    onShow(options) {},
    // 小程序从前台进入后台时触发
    onHide() {},
    // 小程序发生脚本错误或 API 调用报错时触发
    onError(msg) {},
    // 小程序要打开的页面不存在时触发
    onPageNotFound() {},

    /* Global Data */
    //globalData: {},

    /* Global Methods */

});
</script>

<style lang="less">
page {
    background: #f6f6f6;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: flex-start;
}
</style>
