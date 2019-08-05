const less = require('less');
const chalk = require('chalk');
// const lessImportLoadPlugin = require('./less/less-import-load-plugin');

// compile less
module.exports = async (content, options = {}) => {
    const { file } = options; // 原文件信息

    const res = await less.render(content, {
        compress: false,
        filename: file ? file.path : undefined,
        // plugins: [lessImportLoadPlugin()],
        plugins: [],
    }).catch(err => {
        const extract = !err.line ? err.extract
            : err.extract.map((s, i) => (!s ? ''
                : `${chalk.hex('#999')(err.line - 1 + i)} ${s}`));
        err.fragment = extract.join('\n');
        throw err;
    });

    // 返回 css
    return res.css;
};
