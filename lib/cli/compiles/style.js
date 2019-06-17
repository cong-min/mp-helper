const styleCompilers = {
    less: require('./style/less'),
};

async function compileStyle(content, options = {}) {
    const { attrs } = options;

    // 特殊语法编译
    const compiler = styleCompilers[attrs.lang];
    if (compiler) {
        content = await compiler(content, options);
    }

    return content;
}

module.exports = compileStyle;
