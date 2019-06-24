/* 注册组件 */
import store from './managers/store';
import context from './managers/context';
import computed from './behaviors/computed';
import injects from './injects';

const $constructor = 'Component';

function _Component(options = {}) {
    options.$constructor = $constructor;
    // store 初始化入 data
    options = store.initOptions(options);

    // mixin Behaviors
    options.behaviors = options.behaviors || [];
    options.behaviors.push(computed); // computed Behaviors

    /* 生命周期 */
    options.lifetimes = options.lifetimes || {};
    const {
        created,
        attached,
        ready,
        detached
    } = options.lifetimes;

    // 创建
    function _created(...args) {
        this.__options = options; // 参数
        this.$constructor = $constructor;
        // 初始化注入
        injects.injectAppInstance.call(this);
        injects.injectSetData.call(this);
        injects.injectEmitter.call(this);
        // 注册 store 全局数据能力
        store.register.call(this);
        created && created.call(this, ...args);
    }

    // 进入页面树 (该生命周期下可获取当前页面实例)
    function _attached(...args) {
        // 注入页面实例
        injects.injectPageInstance.call(this);
        attached && attached.call(this, ...args);
    }

    // 布局完成 (该生命周期下当前页面实例已完成创建)
    function _ready(...args) {
        // 注册 context 上下文数据能力
        context.register.call(this);
        ready && ready.call(this, ...args);
    }

    // 摧毁
    function _detached(...args) {
        // 注销 store 全局数据能力
        store.unregister.call(this);
        // 注销 context 上下文数据能力
        context.unregister.call(this);
        detached && detached.call(this, ...args);
    }

    options.lifetimes.created = _created;
    options.lifetimes.attached = _attached;
    options.lifetimes.ready = _ready;
    options.lifetimes.detached = _detached;

    return Component(options);
}

export default _Component;
