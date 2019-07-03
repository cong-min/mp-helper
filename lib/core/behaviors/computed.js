import isFunction from 'lodash/isFunction';
import isObject from 'lodash/isObject';
import get from 'lodash/get';
import set from 'lodash/set';
import injects from '../injects';

const computed = Behavior({
    lifetimes: {
        attached() {
            injects.injectSetData.call(this);
            const vm = this;
            // 创建时再次执行 computed
            const options = vm.__options || {};
            const $computed = options.$computed || {};
            const needUpdate = {};
            Object.keys($computed).forEach(key => {
                const config = $computed[key];
                if (!config || !config.get) return;
                const dependPath = Array.isArray(config.depend) ? config.depend : [];
                let value;
                try {
                    value = config.get.apply(vm, dependPath.map(p => get(vm.data, p)));
                } catch (err) { console.error(`computed ${key} error`, err); }
                if (!value || value === vm.data[key]) return;
                needUpdate[key] = value;
            });
            vm.__setData(needUpdate);
        }
    },

    // 定义段过滤器
    definitionFilter(defFields) {
        defFields.properties = defFields.properties || {}; // 传值
        defFields.data = defFields.data || {}; // 数据
        defFields.$computed = defFields.$computed || {}; // 计算属性
        defFields.observers = defFields.observers || {}; // 数据监听器

        // 将 properties 注入 data 中
        Object.keys(defFields.properties).forEach(key => {
            const prop = defFields.properties[key];
            if (typeof prop === 'object'
                && Object.prototype.hasOwnProperty.call(prop, 'value')) {
                // 处理值
                defFields.data[key] = prop.value;
            }
        });

        const observerMap = {}; // 需要监听key与计算属性的对应关系
        Object.keys(defFields.$computed).forEach(key => {
            const obj = defFields.$computed[key];
            let config = {};
            if (isFunction(obj)) {
                config.get = obj;
            } else if (isObject(obj)) {
                config = obj;
            }
            defFields.$computed[key] = config;
            if (!config.get) return;
            // 依赖路径
            const dependPath = Array.isArray(config.depend) ? config.depend : [];
            // 需要监听的key
            const observerKey = dependPath.length ? dependPath.join(',') : '__none__';
            observerMap[observerKey] = observerMap[observerKey] || {};
            observerMap[observerKey][key] = config.get;
            // 初始化computed（尝试首次执行初始化）
            try {
                set(defFields.data, key, config.get.apply(defFields,
                    dependPath.map(p => get(defFields.data, p))));
            } catch (err) { console.error(`computed ${key} error`, err); }
        });

        // 合并追加监听
        Object.keys(observerMap).forEach(observerKey => {
            if (observerKey === '__none__') return; // 未指定依赖
            const computeds = observerMap[observerKey];
            const __observerHandler = defFields.observers[observerKey]; // 其他的监听响应
            function observerHandler(...args) {
                const vm = this;
                // 合并相同的监听，同时设置数据
                this.__setData(
                    Object.keys(computeds).reduce((obj, computedKey) => {
                        obj[computedKey] = computeds[computedKey].apply(vm, args);
                        return obj;
                    }, {})
                );
                __observerHandler && __observerHandler.call(vm, ...args); // 调用其他响应
            }
            defFields.observers[observerKey] = observerHandler;
        });
    },
});

export default computed;
