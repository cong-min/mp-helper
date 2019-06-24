/* 注册页面 */
import store from './managers/store';
import context from './managers/context';
import injects from './injects';

const $constructor = 'Page';

function _Page(options = {}) {
    options.$constructor = $constructor;
    // store 初始化入 data
    options = store.initOptions(options);

    /* 生命周期 */
    const { onLoad, onUnload } = options;

    // 页面加载
    function _onLoad(...args) {
        this.__options = options; // 参数
        this.$constructor = $constructor;
        // 初始化注入
        injects.injectAppInstance.call(this);
        injects.injectPageInstance.call(this);
        injects.injectSetData.call(this);
        injects.injectEmitter.call(this);
        // 注册 store 全局数据能力
        store.register.call(this);
        // 注册 context 上下文数据能力
        context.register.call(this);
        onLoad && onLoad.call(this, ...args);
    }

    // 页面卸载
    function _onUnload(...args) {
        // 注销 store 全局数据能力
        store.unregister.call(this);
        // 注销 context 上下文数据能力
        context.unregister.call(this);
        onUnload && onUnload.call(this, ...args);
    }

    options.onLoad = _onLoad;
    options.onUnload = _onUnload;

    return Page(options);
}

export default _Page;
