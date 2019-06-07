const parse5 = require('parse5');

// parse .mp
module.exports = (content, options = {}) => {
    // 解析 html
    const documentFragment = parse5.parseFragment(content || '');

    const nodes = documentFragment.childNodes || [];
    // 筛选根节点
    return nodes.filter(node => node.tagName).map(node => ({
        tag: node.tagName,
        attrs: node.attrs,
        content: (parse5.serialize(node.content || node) || '').trim(),
    }));
};
