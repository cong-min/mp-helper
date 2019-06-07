#!/usr/bin/env node
const program = require('commander');
const chalk = require('chalk');
const packageJSON = require('../package.json');
const mainAction = require('../lib/cli');

program
    .arguments('<input> <output>')
    .option('-w, --watch', '监听文件变化')
    .action((input, output, cmd) => {
        const { watch } = cmd;
        mainAction(input, output, { watch });
    });

// 版本与帮助信息
program
    .version(packageJSON.version, '-v, --version')
    .on('--help', () => {
        console.log('\nArguments:');
        console.log('  <input>   输入路径 (Globs 规则)');
        console.log('  <output>  输出路径');
        console.log('\nExamples:');
        console.log(`${chalk.gray('$')} mp-helper ./src ./dist`);
        console.log(`${chalk.gray('$')} mp-helper -w ./src ./dist`);
        console.log(`${chalk.gray('$')} mp-helper "src/**.mp" ./dist`);
    });

program.parse(process.argv);

// 默认显示帮助
if (!program.args.length) program.help();
