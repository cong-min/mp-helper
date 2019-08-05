const path = require('path');
const through2 = require('through2');
const File = require('vinyl');
const PluginError = require('plugin-error');
const chalk = require('chalk');
const parseMp = require('../parses/mp');
const compiles = require('../compiles');
const relative = require('../utils/relative');
const logger = require('../utils/logger');

const blockExtMap = {
    config: '.json',
    template: '.wxml',
    script: '.js',
    style: '.wxss',
};

// mp-loader 返回 stream transform
module.exports = (options = {}) => {
    // 混入默认配置
    options = Object.assign({}, options);

    async function mpLoader(file, enc, next) {
        const self = this; // main transform `this`

        if (file.isNull()) return next(null, file);
        if (file.isStream()) return next(new PluginError('mp-helper.cli', 'Streaming not supported'));

        // 获取文件内容
        const fileContent = String(file.contents);

        // parse 解析内容
        const blocks = parseMp(fileContent);

        logger.info({ icon: 'success' }, '解析', relative(file.path));

        const outputFiles = {}; // 输出

        try {
            // 编译并写入内容
            await Promise.all(blocks.map(async ({ tag, attrs, content }) => {
                const ext = blockExtMap[tag]; // 获取标签文件后缀
                if (!ext) return;
                // 如果未定义输出，则创建输出文件
                if (!outputFiles[tag]) {
                    outputFiles[tag] = new File({
                        cwd: file.cwd,
                        base: file.base,
                        path: path.join(file.dirname, `${file.stem}${ext}`),
                        contents: Buffer.from(''),
                    });
                }
                try {
                    const compiledContent = await compiles[tag](content, {
                        attrs,
                        file, // 原文件信息
                    });
                    const { contents } = outputFiles[tag];
                    outputFiles[tag].contents = Buffer.concat([
                        contents,
                        Buffer.from(contents.length ? '\n\n' : ''),
                        Buffer.from(compiledContent || '')
                    ]);
                } catch (err) {
                    logger.error('编译', relative(outputFiles[tag].path));
                    // 向上抛出错误
                    if (err.fragment) {
                        err.fragment = `${chalk.hex('#999')(`<${tag}>`)}\n${err.fragment}`;
                    }
                    err.filename = `${relative(file.path)} <${tag}>`;
                    throw err;
                }
            })).then(() => {
                // push outputs
                Object.keys(outputFiles).forEach(tag => {
                    const outputFile = outputFiles[tag];
                    if (self.push) {
                        self.push(outputFile);
                        // 打印信息
                        const outputs = options.outputs || [];
                        outputs.forEach(output => {
                            const relativePath = relative(outputFile.path,
                                { cwd: outputFile.base });
                            logger.success('生成', relative(path.join(output, relativePath)));
                        });
                    }
                });
            });

            return next();
        } catch (err) {
            return next(new PluginError('mp-helper.cli', err, {
                showProperties: false,
            }));
        }
    }

    return through2.obj(mpLoader);
};
