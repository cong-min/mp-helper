const path = require('path');

// 相当于运行环境的路径
module.exports = (filepath, options = {}) =>
    path.relative(options.cwd || process.cwd(), filepath);
