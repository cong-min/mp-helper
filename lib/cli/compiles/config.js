const defaultContent = '{}';

async function compileConfig(content, options = {}) {
    // 直出
    return content || defaultContent;
}

module.exports = compileConfig;
