module.exports = {
    extends: ['soda-design'],
    globals: {
        // [key] 填入项目内需要的全局变量
        // [value] Boolean 表示这个全局变量是否允许被重新赋值
        'wx': false, // wx 全局变量
        'App': false, // App 全局变量
        'Page': false, // Page 全局变量
    },
};
