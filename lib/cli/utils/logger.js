const chalk = require('chalk');
const dayjs = require('dayjs');
const icons = require('./icons');

const logConfig = {
    log: { style: chalk.blue },
    info: { style: chalk.cyan },
    success: { style: chalk.green },
    warn: { style: chalk.yellow },
    error: { style: chalk.red },
};

const logger = {
    disabled: false, // 是否禁用
};

Object.keys(logConfig).forEach(key => {
    const { style } = logConfig[key];
    logger[key] = (...args) => {
        if (logger.disabled) return;
        let options = {},
            prefix,
            message,
            additionals;
        // 如果第一个参数为对象，则为配置项
        if (typeof args[0] === 'object') {
            [options = {}, ...args] = args;
        }
        args = args || [];
        // 如果后续参数只有一个，则仅为 message
        if (args.length === 1) {
            [message] = args;
        } else {
            [prefix = '', message = '', ...additionals] = args;
        }
        let icon = icons[options.icon || key];
        icon = icon || '';
        prefix = prefix || '';
        message = message || '';
        additionals = additionals || [];
        // 格式 heading icon prefix message ...additionals
        console.log(
            chalk.gray(`[${dayjs().format('HH:mm:ss.SSS')}]`),
            [
                style(icon),
                style(prefix),
                message,
            ].filter(Boolean).join(' '),
            ...additionals
        );
    };
});

module.exports = logger;
