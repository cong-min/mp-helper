/* 注册小程序 */
import store from './managers/store';
import injects from './injects';

const $constructor = 'App';

function _App(options = {}) {
    options.$constructor = $constructor;
    /* 生命周期 */
    const { onLaunch } = options;

    // 初始化完成
    function _onLaunch(...args) {
        this.__options = options; // 参数
        this.$constructor = $constructor;
        // 初始化注入
        injects.injectAppInstance.call(this);
        injects.injectEmitter.call(this);
        // 注入 $setSotre 方法
        store.injectSetStore.call(this);
        onLaunch && onLaunch.call(this, ...args);
    }

    options.onLaunch = _onLaunch;

    return App(options);
}

export default _App;
