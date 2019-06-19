import kebabCase from 'lodash/kebabCase';

// 将对象形式 style 转换为行内字符串
function inlineStyles(bindingStyle = {}) {
    return Object.keys(bindingStyle)
        .map(key => (key && bindingStyle[key]
            ? `${kebabCase(key)}:${bindingStyle[key]}` : null))
        .filter(Boolean)
        .join(';');
}

export default inlineStyles;
