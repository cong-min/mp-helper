import emitter, { mitt } from '../managers/emitter';

// 注入 setData 重写
function injectSetData() {
    if (this.__setData) return; // 已经注入
    const __setData = this.__setData = this.setData; // 原
    // 重写 setData
    function $setData(data, callback) {
        __setData.call(this, data, callback);
    }
    this.setData = this.$setData = $setData; // 新
}

// 注入 $app 实例
function injectAppInstance() {
    this.$app = this.$constructor === 'App' ? this : getApp();
}

// 注入 $page 实例 (需在合适的时机调用)
function injectPageInstance() {
    function getCurrentPage() { // 获取当前页面
        const pages = getCurrentPages();
        return pages[pages.length - 1];
    }
    this.$page = getCurrentPage();
}

// 注入事件监听
function injectEmitter() {
    if (this.$constructor === 'App') {
        // 全局事件
        this.$on = emitter.on;
        this.$off = emitter.off;
        this.$emit = emitter.emit;
    } else {
        // 局部单元事件
        const unitEmitter = mitt();
        this.__emitter = unitEmitter;
        this.$on = unitEmitter.on;
        this.$off = unitEmitter.off;
        this.$emit = unitEmitter.emit;
    }
}

export default {
    injectSetData,
    injectAppInstance,
    injectPageInstance,
    injectEmitter,
};
