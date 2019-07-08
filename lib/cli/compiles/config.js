const _eval = require('eval');

const defaultContent = '{}';

async function compileConfig(content, options = {}) {
    const { attrs, file } = options;

    let json;
    if (attrs.lang === 'js') { // 如果是 js 代码则执行
        try {
            json = _eval(content, file ? file.path : '');
            json = JSON.stringify(json, null, 4);
        } catch (err) {
            err.message = `未正确导出页面配置对象\n${err.message}`;
            throw err;
        }
    } else {
        // 直出
        json = content;
    }
    return json || defaultContent;
}

module.exports = compileConfig;
