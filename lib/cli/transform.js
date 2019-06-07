const through2 = require('through2');
const PluginError = require('plugin-error');
const chalk = require('chalk');
const { rules: loaderRules } = require('./loader');
const relative = require('./utils/relative');
const logger = require('./utils/logger');
const icons = require('./utils/icons');

module.exports = (options = {}) => {
    // 混入默认配置
    options = Object.assign({}, options);

    return through2.obj(async function _transform(file, enc, cb) { // function keep `this`
        const self = this;

        if (file.isNull()) return cb(null, file);
        if (file.isStream()) return cb(new PluginError('mp-parser', 'Streaming not supported'));

        try {
            // 找出对应 loader rule
            const rule = loaderRules.find(e => e.test.test(file.basename));
            // 如果没有则拷贝
            if (!rule) {
                logger.log(`${icons.copy} 拷贝`, relative(file));
                return cb(null, file);
            }

            // 依次运行 loaders
            const { use: loaders = [] } = rule;
            for (let loader of loaders) {
                loader = loader.bind(self);
                await loader(file, options);
            }

            return cb();
        } catch (err) {
            if (err.filename) {
                err.message += chalk.hex('#999')(` @ ${err.filename} (${err.line || 1}:${err.column || 1})`);
            }
            if (err.fragment) {
                err.message += `\nFragment:\n${err.fragment}`;
            }
            return cb(new PluginError('mp-parser', err, {
                showProperties: false,
            }));
        }
    });
};
