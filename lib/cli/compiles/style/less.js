const less = require('less');
const chalk = require('chalk');

// compile less
module.exports = async (content, options = {}) => {
    const res = await less.render(content, {
        compress: false,
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
