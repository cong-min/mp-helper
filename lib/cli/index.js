const path = require('path');
const fs = require('fs');
const del = require('del');
const chalk = require('chalk');
const gulp = require('gulp');
const globParent = require('glob-parent');
const transform = require('./transform');
const logger = require('./utils/logger');
const relative = require('./utils/relative');

const cwd = process.cwd();

let inputBase; // 输入路径的 glob-base (glob-parent)

// 执行任务
function job(input, output) {
    return gulp.src(input, {
        cwd,
        base: inputBase,
        allowEmpty: true,
        dot: true,
    })
        .pipe(transform())
        .pipe(gulp.dest(output));
}

// 监听
function watch(input, output) {
    const watcher = gulp.watch(input, {
        cwd,
    });
    logger.info({ icon: 'pending' }, '监听中...', input);
    // 内容变更
    watcher.on('change', filepath => {
        logger.log({ icon: 'arrow' }, '变更', filepath);
        job(filepath, output);
    });
    // 文件添加
    watcher.on('add', filepath => {
        logger.log({ icon: 'add' }, '添加', filepath);
        job(filepath, output);
    });
    // 文件删除
    watcher.on('unlink', filepath => {
        logger.log({ icon: 'remove' }, '删除', filepath);
        job(filepath, output);
    });
    return watcher;
}

// 清理
function clean(output) {
    return del(output).then(() => {
        logger.warn({ icon: 'success' }, '清理', relative({ path: output }));
    });
}

// 执行主任务
function main(input, output, options) {
    console.log(chalk.blue('[ MP Helper ]'));
    input = input || 'src';
    output = output || 'dist';
    const {
        watch: isWatch = false,
        clean: isClean = true,
    } = options || {}; // 配置项
    output = path.resolve(cwd, output);
    // 判断是否input是否为已存在的文件夹
    const inputPath = path.resolve(cwd, input);
    if (fs.existsSync(inputPath) && fs.statSync(inputPath).isDirectory()) {
        input += '/**'; // 已存在的文件夹则默认操作为读取其内所有内容
    }

    // 获取 input 的 glob-base (glob-parent)
    inputBase = path.resolve(cwd, globParent(input));

    gulp.series(...[
        // 清理 dest
        isClean ? () => clean(output) : null,
        // gulp 执行任务
        () => job(input, output),
        // gulp 监听
        isWatch ? () => watch(input, output) : null,
    ].filter(Boolean))();

    gulp.on('error', ({ error = '' }) => console.error(error.toString()));
}

module.exports = main;
