import computedBehavior from 'miniprogram-computed';

// 注册组件
function _Component(options = {}) {
    /* mixin Behaviors */
    options.behaviors = options.behaviors || [];
    // computed Behaviors
    // https://github.com/wechat-miniprogram/computed
    options.behaviors.push(computedBehavior);

    return Component(options);
}

export default _Component;
