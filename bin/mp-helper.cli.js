#!/usr/bin/env node
const path = require('path');
const fs = require('fs');
const program = require('commander');
const chalk = require('chalk');
const packageJSON = require('../package.json');
const mainAction = require('../lib/cli');
const relative = require('../lib/cli/utils/relative');

const cwd = process.cwd();

program
    .name('mp-helper')
    .usage('[options] <input...> <output>')
    .arguments('[io...]')
    .option('-w, --watch', '监听文件变化')
    .option('-c, --config [config]', '高级配置模式 (默认读取 ./package.json)')
    .action((io, { watch, config }) => {
        // io 和 config 都没有时显示 help
        if (!io.length && !config) {
            program.help();
            return process.exit(1);
        }

        let options = {};
        // 如果是高级配置模式
        if (config) {
            // 未指定具体路径, 则使用默认路径
            let configPath = config === true ? cwd
                : path.join(cwd, config);
            // 判断 configPath 是否存在
            if (!fs.existsSync(configPath)) {
                console.error(`error: cannot find config '${relative(configPath)}'`);
                return process.exit(1);
            }
            // configPath 可能为文件夹，也可能为文件
            if (fs.statSync(configPath).isDirectory()) {
                // 如果为文件夹，则追加 package.json
                configPath = path.join(configPath, 'package.json');
            }
            try {
                options = require(configPath);
                options = options['mp-helper'] || {};
            } catch (err) {
                console.error(`error: cannot resolve config '${relative(configPath)}'`);
                return process.exit(1);
            }
            // 当有配置文件时，cwd将指向配置文件的路径，用以解析配置文件内的路径
            options.cwd = path.dirname(configPath);
        }

        // 解析 IO
        if (io.length === 1) {
            console.error('error: missing argument `<output>`');
            return process.exit(1);
        } else if (io.length > 1) {
            options.io = options.io || [];
            options.io.push({
                output: io.splice(io.length - 1, 1), // 删除末尾
                input: io, // 删除后的数组
                cwd: process.cwd(), // 来着命令行的配置，cwd 为 process.cwd()
            });
        }

        options.watch = watch; // 是否在监听
        return mainAction(options);
    });

// 版本与帮助信息
program
    .version(packageJSON.version, '-v, --version')
    .on('--help', () => {
        console.log('\nArguments:');
        console.log('  <input>   输入路径 (Globs 规则)');
        console.log('  <output>  输出路径');
        console.log('\nExamples:');
        console.log(chalk.gray('# 纯命令行模式'));
        console.log(`${chalk.gray('$')} mp-helper ./src ./dist`);
        console.log(`${chalk.gray('$')} mp-helper -w ./src ./dist`);
        console.log(`${chalk.gray('$')} mp-helper "src/**.mp" ./dist`);
        console.log(chalk.gray('# 高级配置模式 (读取 ./package.json `mp-helper` 字段)'));
        console.log(`${chalk.gray('$')} mp-helper -c`);
        console.log(`${chalk.gray('$')} mp-helper -c -w`);
    });

program.parse(process.argv);
