<config>
{
    "component": true
}
</config>

<template>
<view class="wrapper">

</view>
</template>

<script>
import mp from 'mp-helper';
// 注册 Component
mp.Component({
    // 配置项
    options: {
        //addGlobalClass: true, // 是否支持全局样式
    },

    // 引用组件混入
    //behaviors: [],
    // 定义组件间关系
    //relations: {},

    // 组件接受的外部样式类
    //externalClasses: [],
    // 组件的对外属性
    properties: {

    },
    // 组件的内部数据
    data: {

    },
    // 组件的计算数据 (mp-helper 增强API)
    $computed: {

    },
    // 组件数据字段监听器
    observers: {},

    /* 组件生命周期 */
    lifetimes: {
        // 组件实例被创建
        //created() {},
        // 组件实例进入页面节点树
        //attached() {},
        // 页面组件初始化完成
        ready() {},
        // 组件实例被移动到节点树另一个位置
        //moved() {},
        // 组件实例被从页面节点树移除
        detached() {},
    },
    /* 组件所在页面的生命周期 */
    pageLifetimes: {
        // 页面被展示
        show() {},
        // 页面被隐藏
        hide() {},
        // 页面尺寸变化
        resize(size) {}
    },

    /* Methods */
    methods: {

    }
});
</script>

<style lang="less">
component-tag/*component-tag 替换为组件标签名*/{
    .wrapper {

    }
}
</style>
