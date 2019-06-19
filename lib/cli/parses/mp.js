const sfcCompiler = require('vue-template-compiler');

// parse .mp
module.exports = (content, options = {}) => {
    const sfc = sfcCompiler.parseComponent(content, { pad: 'space' });
    // 处理标签块
    const keys = ['template', 'script', 'styles', 'customBlocks']; // 需要提取的keys

    let blocks = []; // 结果
    keys.forEach(key => {
        let block = sfc[key];
        if (!block) return;
        if (!Array.isArray(block)) block = [block];
        block = block.filter(e => e.type).map(e => ({
            tag: e.type,
            attrs: e.attrs,
            content: (e.content || '').trim(),
        }));
        blocks = blocks.concat(block);
    });

    return blocks;
};
