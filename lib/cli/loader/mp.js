const path = require('path');
const File = require('vinyl');
const chalk = require('chalk');
const parseMp = require('../parses/mp');
const compiles = require('../compiles');
const parseAttrs = require('../utils/parseAttrs');
const relative = require('../utils/relative');
const logger = require('../utils/logger');

const blockExtMap = {
    config: '.json',
    template: '.wxml',
    script: '.js',
    style: '.wxss',
};

async function mpLoader(file, options = {}) {
    const self = this; // through2 transform this

    // 获取文件内容
    const fileContent = String(file.contents);

    // parse 解析内容
    const blocks = parseMp(fileContent);

    logger.info({ icon: 'success' }, '解析', relative(file));

    const outputs = {}; // 输出

    // 编译并写入内容
    await Promise.all(blocks.map(async ({ tag, attrs, content }) => {
        const ext = blockExtMap[tag]; // 获取标签文件后缀
        if (!ext) return;
        // 如果未定义输出，则创建输出文件
        if (!outputs[tag]) {
            outputs[tag] = new File({
                cwd: file.cwd,
                base: file.base,
                path: path.join(file.dirname, `${file.stem}${ext}`),
                contents: Buffer.from(''),
            });
        }
        try {
            const compiledContent = await compiles[tag](content, {
                attrs: parseAttrs(attrs),
            });

            outputs[tag].contents = Buffer.concat([
                outputs[tag].contents,
                Buffer.from(compiledContent || '')
            ]);
        } catch (err) {
            logger.error('编译', relative(outputs[tag]));
            // 向上抛出错误
            if (err.fragment) {
                err.fragment = `${chalk.hex('#999')(`<${tag}>`)}\n${err.fragment}`;
            }
            err.filename = `${relative(file)} <${tag}>`;
            throw err;
        }
    })).then(() => {
        // push outputs
        Object.keys(outputs).forEach(tag => {
            self.push(outputs[tag]);
            logger.success('写入', relative(outputs[tag]));
        });
    });
}

// mp-loader
module.exports = mpLoader;
