module.exports = {
    extends: ['soda-works'],
    globals: {
        // [key] 填入项目内需要的全局变量
        // [value] Boolean 表示这个全局变量是否允许被重新赋值
        'wx': false, // wx 全局变量
        'App': false, // App 全局变量
        'getApp': false,
        'Page': false, // Page 全局变量
        'getCurrentPages': false,
        'Component': false, // Component 全局变量
        'Behavior': false,
    },
};
