'use strict';

var version = "0.2.1";

// 注册小程序
function _App(options) {
    return App(options);
}

// 注册页面
function _Page(options) {
    return Page(options);
}

// 注册组件
function _Component(options) {
    return Component(options);
}

var index = {
    version,
    App: _App,
    Page: _Page,
    Component: _Component,
};

module.exports = index;
