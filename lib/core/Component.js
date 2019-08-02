/* 注册组件 */
import store from './managers/store';
import context from './managers/context';
import router from './managers/router';
import computed from './behaviors/computed';
import injects from './injects';

const $constructor = 'Component';

// 判断是否为组件化页面 (即利用 Component 构造页面)
function isComponentPage(self) { return self && self === self.$page; }

function _Component(options = {}) {
    options.$constructor = $constructor;

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
    options.methods = options.methods || {};
    const { onLoad } = options.methods;

    // 创建
    function _created(...args) {
        this.$constructor = $constructor;
        // 初始化注入
        injects.injectKeepOptions.call(this, options);
        injects.injectAppInstance.call(this);
        injects.injectSetData.call(this);
        injects.injectEmitter.call(this);
        created && created.apply(this, args);
    }

    // 进入页面树 (该生命周期下可获取到当前页面实例，但未创建完成)
    function _attached(...args) {
        // 注册 store 全局数据能力
        store.register.call(this);
        // 注入页面实例
        injects.injectPageInstance.call(this);
        attached && attached.apply(this, args);
    }

    // 页面加载 (当注册为组件化页面时才会触发)
    function _onLoad(...args) {
        if (isComponentPage(this)) {
            // 注册 context 上下文数据能力
            context.register.call(this);
            // 注册路由 (同时解析并重写 query / args[0])
            router.injectRoute.call(this, args);
        }
        onLoad && onLoad.apply(this, args);
    }

    // 布局完成 (该生命周期为当前页面实例 onLoad 完成)
    function _ready(...args) {
        if (!isComponentPage(this)) {
            // 注册 context 上下文数据能力
            context.register.call(this);
            // 注册路由
            router.injectRoute.call(this);
        }
        ready && ready.apply(this, args);
    }

    // 摧毁
    function _detached(...args) {
        // 注销 store 全局数据能力
        store.unregister.call(this);
        // 注销 context 上下文数据能力
        context.unregister.call(this);
        detached && detached.apply(this, args);
    }

    options.lifetimes.created = _created;
    options.lifetimes.attached = _attached;
    options.methods.onLoad = _onLoad;
    options.lifetimes.ready = _ready;
    options.lifetimes.detached = _detached;

    return Component(options);
}

export default _Component;
