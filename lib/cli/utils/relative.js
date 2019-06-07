const path = require('path');

module.exports = ({ cwd = process.cwd(), path: filepath }) =>
    path.relative(cwd, filepath);
