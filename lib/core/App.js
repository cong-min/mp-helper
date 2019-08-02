/* 注册小程序 */
import store from './managers/store';
import injects from './injects';
import router from './managers/router';

const $constructor = 'App';

function _App(options = {}) {
    options.$constructor = $constructor;
    /* 生命周期 */
    const { onLaunch } = options;

    // 初始化完成
    function _onLaunch(...args) {
        this.$constructor = $constructor;
        // 初始化注入
        injects.injectKeepOptions.call(this, options);
        injects.injectAppInstance.call(this);
        injects.injectPageInstance.call(this);
        injects.injectEmitter.call(this);
        router.injectRoute.call(this);
        // 注入 $setSotre 方法
        store.injectSetStore.call(this);
        onLaunch && onLaunch.apply(this, args);
    }

    options.onLaunch = _onLaunch;

    return App(options);
}

export default _App;
