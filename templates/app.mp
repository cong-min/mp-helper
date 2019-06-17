<config lang="json">
{
    "navigationBarBackgroundColor": "#ffffff",
    "navigationBarTextStyle": "black",
    "navigationBarTitleText": "演示页面",
    "backgroundColor": "#eeeeee",
    "backgroundTextStyle": "light"
}
</config>

<script>
import mp from 'mp-helper';
// 注册 App
mp.App({
    onLaunch (options) {
        // Do something initial when launch.
    },
    onShow (options) {
        // Do something when show.
    },
    onHide () {
        // Do something when hide.
    },
    onError (msg) {
        console.log(msg)
    },
    /**/
    globalData: 'I am global data'

    /* Methods */
});
</script>

<style lang="less">
.container {
    background: #fff;
}
</style>
