import classNames from 'classnames';
import promiser from './promiser';
import inlineStyles from './inlineStyles';
import urlString from './urlString';
import { mitt } from '../managers/emitter';

export default {
    // 将原生 api 转换为 promise
    promiser,
    // 类名连接 https://github.com/JedWatson/classnames
    classNames,
    // 行内样式连接
    inlineStyles,
    // urlString url解析器
    urlString,
    // 事件管理器
    mitt,
};
