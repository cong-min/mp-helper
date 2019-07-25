import set from 'lodash/set';
import mapKeys from 'lodash/mapKeys';
import merge from 'lodash/merge';

// 注入 $setStore 方法
function injectSetStore() {
    const vm = this;
    // 在实例上注册 $setStore 方法
    function $setStore(...args) {
        const obj = args[0] || {};
        Object.keys(obj).forEach(key => {
            set(vm.$app.$store, key, obj[key]);
        });
        return vm.$app.$emit('$setStore', ...args);
    }
    vm.$setStore = $setStore;
}

// 生命周期创建时, 注册监听 store
function register() {
    const vm = this;
    if (!vm.$app || !vm.$app.$constructor) return;
    // 合并全局数据
    vm.$app.$store = merge({}, vm.$app.$store, vm.__options.$store);
    // 初始化数据
    vm.__setData({
        $store: vm.$app.$store,
        _store: vm.$app.$store,
    });
    // 在实例上监听 $setStore 事件
    function setStoreHandler(obj, callback) {
        return vm.setData({
            // 在 key 前追加 $store
            ...mapKeys(obj, (value, key) =>
                ['$store', key].join(/^\[/.test(key) ? '' : '.')),
            // 在 key 前追加 _store (用于兼容 observers 在低版本支持 $ 开头属性名的监听)
            ...mapKeys(obj, (value, key) =>
                ['_store', key].join(/^\[/.test(key) ? '' : '.')),
        }, callback);
    }
    vm.__setStoreHandler = setStoreHandler;
    vm.$app.$on('$setStore', setStoreHandler);
    // 注入
    injectSetStore.call(this);
}

// 生命周期摧毁时, 注销监听 store
function unregister() {
    const vm = this;
    if (!vm.__setStoreHandler) return;
    vm.$app.$off('$setStore', vm.__setStoreHandler);
}

export default {
    injectSetStore,
    register,
    unregister,
};
