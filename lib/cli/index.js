const path = require('path');
const fs = require('fs');
const del = require('del');
const chalk = require('chalk');
const gulp = require('gulp');
const globParent = require('glob-parent');
const dayjs = require('dayjs');
const packageJSON = require('../../package.json');
const pipeline = require('./pipeline');
const logger = require('./utils/logger');
const relative = require('./utils/relative');

// 默认配置值
const defaultOptions = {
    io: [{
        input: 'src',
        output: 'dist',
    }],
    watch: false,
    clean: false,
    extractDeps: true,
    cwd: process.cwd(),
};

const errorHandler = error => console.error(`${String(error)}\n`);

// 执行任务 (input 为单个glob字符串、outputs 为数组、taskOptions 更多配置)
function task(input, outputs, cwd, taskOptions = {}) {
    const inputBase = taskOptions.inputBase || globParent(input);
    const stream = gulp.src(input, {
        cwd,
        // base 为 inputbase 后续将替换为 dest
        base: path.join(cwd, inputBase),
        allowEmpty: true,
        dot: true,
    }).pipe(pipeline({
        ...taskOptions,
        outputs,
        inputBase,
    }));
    outputs.forEach(o =>
        stream.pipe(gulp.dest(o)));
    stream.on('error', errorHandler);
    return stream;
}

// 监听 (input 为单个glob字符串、outputs 为数组)
function watch(input, outputs, cwd, watchOptions = {}) {
    const watcher = gulp.watch(input, {
        cwd,
    });
    const inputBase = watchOptions.inputBase || globParent(input); // 输入路径的 glob-base (glob-parent)
    const listener = (logOptions, logMessage, filepath) => {
        logger.log(logOptions, logMessage, relative(path.join(cwd, filepath)));
        return task(filepath, outputs, cwd, {
            ...watchOptions,
            inputBase,
        });
    };
    logger.info({ icon: 'pending' }, '监听',
        relative(path.join(cwd, inputBase)),
        chalk.hex('#999')(`[ ${input} ]`));
    // 内容变更
    watcher.on('change', filepath => {
        listener({ icon: 'arrow' }, '变更', filepath);
    });
    // 文件添加
    watcher.on('add', filepath => {
        listener({ icon: 'add' }, '添加', filepath);
    });
    // 文件删除
    watcher.on('unlink', filepath => {
        listener({ icon: 'remove' }, '删除', filepath);
    });
    watcher.on('error', errorHandler);
    return watcher;
}

// 清理 (output 为单个文件(夹)字符串)
function clean(output) {
    return del(output).then(() => {
        logger.warn({ icon: 'success' }, '清理', relative(output));
    }).catch(errorHandler);
}

// 执行主任务
function main(options = {}) {
    console.log(chalk.blue(`[ MP Helper v${packageJSON.version} ]`));

    // 混入默认配置
    const config = {
        ...defaultOptions,
        ...options,
        // io 默认值处理
        io: options.io && options.io.length ? options.io : defaultOptions.io,
    };

    // 将 io 中 input 展开，单个 input 对应 output 数组
    config.io = config.io.reduce((arr, { input, output, cwd }) => {
        // 保证 input output 皆为数组
        input = Array.isArray(input) ? input : [input];
        output = Array.isArray(output) ? output : [output];
        cwd = cwd || options.cwd || defaultOptions.cwd; // 指定运行路径
        input.forEach(i => {
            if (!i) return;
            // 判断 input 是否为已存在的文件夹
            const inputPath = path.join(cwd, i);
            if (fs.existsSync(inputPath) && fs.statSync(inputPath).isDirectory()) {
                // 已存在的文件夹则默认操作为读取其内所有内容
                i += '/**';
            }
            arr.push({
                input: i,
                output: output.map(o => path.join(cwd, o)),
                cwd,
            });
        });
        return arr;
    }, []);

    if (!config.io.length) return;

    const outputs = [].concat(...config.io.map(e => e.output));

    // 批量 clean
    gulp.task('batchClean', outputs.length ? gulp.parallel(
        ...outputs.map(output =>
            (() => clean(output))) // 返回多个函数
    ) : cb => cb());

    // 批量 task
    gulp.task('batchTask', gulp.parallel(
        ...config.io.map(({ input, output, cwd }) =>
            (() => task(input, output, cwd, config))) // 返回多个可执行函数
    ));

    // 批量 watch
    gulp.task('batchWatch', gulp.parallel(
        ...config.io.map(({ input, output, cwd }) =>
            (() => watch(input, output, cwd, config))) // 返回多个可执行函数
    ));

    const tasks = gulp.series(...[
        // 清理 dest
        config.clean ? 'batchClean' : null,
        // gulp 执行任务
        'batchTask',
        // gulp 监听
        config.watch ? 'batchWatch' : null,
    ].filter(Boolean));

    // catch error
    gulp.on('error', () => {});

    // 执行 series
    const startTime = dayjs();
    tasks((err, res) => {
        if (err) return err;
        if (!config.watch) {
            const endTime = dayjs();
            return logger.success('完成', `耗时 ${chalk.green(`${(endTime - startTime) / 1000} s`)}`);
        }
        return null;
    });
}

module.exports = main;
