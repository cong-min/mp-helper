const path = require('path');
const through2 = require('through2');
const pumpify = require('pumpify');
const PluginError = require('plugin-error');
const chalk = require('chalk');
const relative = require('./utils/relative');
const logger = require('./utils/logger');
const icons = require('./utils/icons');

const mpLoader = require('./loaders/mp');

// loader rules
const rules = [
    {
        test: /\.mp$/,
        use: [mpLoader],
    },
];

// 混入 transform
function mixinTransform(superTransform, currentRule) {
    return function transform(file, enc, next) {
        const self = this; // main transform `this`
        // 判断当前规则是否匹配
        if (!currentRule.test.test(file.path)) {
            return next(null, file);
        }

        return superTransform.bind(self)(file, enc, next);
    };
}

// 未匹配规则，则进行拷贝
function copy(options = {}) {
    // 混入默认配置
    options = Object.assign({}, options);

    function copyTransform(file, enc, next) {
        if (file.isStream()) return next(new PluginError('mp-helper.cli', 'Streaming not supported'));

        if (!file.isNull()
            && !rules.some(rule => rule.test.test(file.path))) {
            // 打印信息
            const outputs = options.outputs || [];
            outputs.forEach(output => {
                const relativePath = relative(file.path,
                    { cwd: file.base });
                logger.log(`${icons.copy} 拷贝`, relative(path.join(output, relativePath)));
            });
        }
        return next(null, file);
    }

    return through2.obj(copyTransform);
}

// loader stream transform
module.exports = (options = {}) => {
    // 混入默认配置
    options = Object.assign({}, options);

    const pipes = [];

    pipes.push(copy(options));

    // 展开 rules 与 loaders
    rules.forEach(rule => {
        const loaders = rule.use || [];
        loaders.forEach(loader => {
            // loader(options) 返回为一个 transform，此处进行混入
            const superStream = loader(options);
            const transform = mixinTransform(superStream._transform, rule);
            const flush = superStream._flush;
            pipes.push(through2.obj(transform, flush));
        });
    });

    const pipeline = pipes.length === 1 ? pipes[0] : pumpify.obj(pipes);

    // 错误信息处理
    pipeline.on('error', (err) => {
        if (err.filename) {
            err.message += chalk.hex('#999')(` @ ${err.filename} (${err.line || 1}:${err.column || 1})`);
        }
        if (err.fragment) {
            err.message += `\nFragment:\n${err.fragment}`;
        }
        return err;
    });

    return pipeline;
};

module.exports.rules = rules;
