import cloneDeep from 'lodash/cloneDeep';
import deepFreeze from 'deep-freeze-strict';
import emitter, { mitt } from '../managers/emitter';

// 注入 options 传入参数的初始态保存
function injectKeepOptions(options) {
    this.__options = cloneDeep(options); // 保存初始化时的参数
    deepFreeze(this.__options); // 冻结传入参数
    // 暴露 $options 以获取传入参数
    this.$options = cloneDeep(this.__options);
    Object.defineProperty(this, '$options', {
        enumerable: true,
        get: () => cloneDeep(this.__options),
    });
}

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
    // app 获取 $page 采用 getter 方式
    if (this.$constructor === 'App') {
        Object.defineProperty(this, '$page', {
            enumerable: true,
            get: getCurrentPage,
        });
    } else {
        this.$page = getCurrentPage();
    }
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
    injectKeepOptions,
    injectSetData,
    injectAppInstance,
    injectPageInstance,
    injectEmitter,
};
