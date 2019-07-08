const _eval = require('eval');

const defaultContent = '{}';

async function compileConfig(content, options = {}) {
    const { attrs, file } = options;

    let config;
    if (attrs.lang === 'js') { // 如果是 js 代码则执行
        try {
            config = _eval(content, file ? file.path : '');
            config.usingComponents = config.usingComponents || {};
            config = JSON.stringify(config, null, 4);
        } catch (err) {
            err.message = `未正确导出页面配置对象\n${err.message}`;
            throw err;
        }
    } else {
        // 直出
        config = content;
    }
    return config || defaultContent;
}

module.exports = compileConfig;
