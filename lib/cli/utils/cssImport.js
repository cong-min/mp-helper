const path = require('path');
const importRegex = require('import-regex');
const trim = require('lodash/trim');

const importExpressionRegex = /@import\s+(?:url\()?(.+(?=['")]))(?:\))?.*/i;

// 找出 css 中的 @import
function find(content = '') {
    // 找出 import urls
    const matchList = content.match(importRegex()) || [];
    return matchList.map((e = '') => {
        const m = e.match(importExpressionRegex) || [];
        // 找到 url 字符串
        return m[1] ? trim(m[1], '\'"') : '';
    }).filter(Boolean);
}

// 替换 css 中引用 npm 的 url, todo 对 @imprort 路径进行替换
function replace(content = '', npms = {}, options = {}) {
    const {
        fileInfo, // 原文件信息
        depPathPrefix = '', // 依赖路径前缀
    } = options;
    // 转换 npms
    const npmValues = Object.keys(npms).map(p => npms[p]);
    // 找出 import urls
    const matchList = content.match(importRegex()) || [];
    matchList.forEach((oldString = '') => {
        const m = oldString.match(importExpressionRegex) || [];
        // 找到 url 路径表达式
        const oldExpression = m[1] ? trim(m[1], '\'"') : '';
        const npm = npmValues.find(obj => obj.expression === oldExpression); // 找到需替换的 npm
        if (oldExpression && npm) {
            const targetPath = path.join(fileInfo.base, depPathPrefix, npm.targetId);
            let newExpression = path.relative(fileInfo.dirname, targetPath);
            newExpression = newExpression.replace(/\\/g, '/'); // 统一替换 \ 为 /
            const newString = oldString.replace(oldExpression, newExpression);
            content = content.replace(oldString, newString);
        }
    });
    return content;
}

// cssImport
module.exports = {
    find,
    replace,
};
