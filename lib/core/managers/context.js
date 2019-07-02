import set from 'lodash/set';
import mapKeys from 'lodash/mapKeys';
import merge from 'lodash/merge';

// 注入 $setContext 方法
function injectSetContext() {
    const vm = this;
    // 在实例上注册 $setContext 方法
    function $setContext(...args) {
        const obj = args[0] || {};
        Object.keys(obj).forEach(key => {
            set(vm.$page.$context, key, obj[key]);
        });
        return vm.$page.$emit('$setContext', ...args);
    }
    vm.$setContext = $setContext;
}

// 生命周期创建时, 注册监听 context
function register() {
    const vm = this;
    if (!vm.$page) return;
    // 合并上下文数据
    vm.$page.$context = merge({}, vm.$page.$context, vm.__options.$context);
    // 初始化数据
    vm.__setData({
        $context: vm.$page.$context,
        _context: vm.$page.$context
    });
    // 在实例上监听 $setContext 事件
    function setContextHandler(obj, callback) {
        return vm.setData({
            // 在 key 前追加 $context
            ...mapKeys(obj, (value, key) =>
                ['$context', key].join(/^\[/.test(key) ? '' : '.')),
            // 在 key 前追加 _context (用于兼容 observers 在低版本支持 $ 开头属性名的监听)
            ...mapKeys(obj, (value, key) =>
                ['_context', key].join(/^\[/.test(key) ? '' : '.')),
        }, callback);
    }
    vm.__setContextHandler = setContextHandler;
    vm.$page.$on('$setContext', setContextHandler);
    // 注入
    injectSetContext.call(this);
}

// 生命周期摧毁时, 注销监听 store
function unregister() {
    const vm = this;
    if (!vm.__setContextHandler) return;
    vm.$page.$off('$setContext', vm.__setContextHandler);
}

export default {
    injectSetContext,
    register,
    unregister,
};
