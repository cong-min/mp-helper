const path = require('path');
const konan = require('konan');
const resolveFrom = require('resolve-from');
const vfs = require('vinyl-fs');
const through2 = require('through2');
const PluginError = require('plugin-error');
const logger = require('./utils/logger');
const icons = require('./utils/icons');
const relative = require('./utils/relative');

const lookupedList = {}; // 已经查找过的文件包信息
const cacheList = {}; // 已处理过的依赖文件

// extractDeps stream transform
module.exports = (options = {}) => {
    // 混入默认配置
    options = Object.assign({
        // 将 npm 依赖解析提取至目标文件夹的名称
        targetDir: 'miniprogram_npm',
    }, options);

    // 通过 file 深度查找出其所需的所有的 npm 依赖文件
    async function lookupDeps(file) {
        // 已处理
        const cached = lookupedList[file.path];
        if (cached) return cached;

        const dirname = file.dirname || __dirname; // 原文件所在路径

        const fileContent = String(file.contents);
        // 找出代码内的 import require 等
        const { strings } = konan(fileContent);

        // 解析依赖路径
        let npms = strings.map(expression => ({
            expression, // 所引入写 moduleId
            path: resolveFrom(dirname, expression), // 源文件路径
        }));

        // 以原地址 npm.path 作为唯一 key，创建所需找到的 npm 对象
        npms = npms.reduce((obj, npm) => {
            if (!npm.path) return obj;
            const { expression } = npm;
            const pathParts = npm.path.replace(/\\/g, '/').split('/');
            const separatIndex = pathParts.lastIndexOf('node_modules'); // 以最后一个 node_modules 作为分割

            // package 部分路径
            const packageParts = separatIndex !== -1
                // 来自 node_modules
                ? pathParts.slice(separatIndex + 1)
                // 不来自 node_modules，只有解析 expression
                : expression.replace(/\\/g, '/').split('/');

            // 解析模块名
            let packageName = '';
            // Handle scoped package name
            if (packageParts.length > 0 && packageParts[0][0] === '@') {
                packageName += `${packageParts.shift()}/`;
            }
            packageName += packageParts.shift();

            // 如果不是一个合法的模块名，则不进行处理
            if (!packageName || /^([.\\/])/.test(packageName)) return obj;

            let targetId = packageParts.join('/'); // 模块将拷贝至的目标路径

            // 如果引入模块主入口，那么则需将入口加至 index.js
            if (packageName === expression) {
                targetId = path.join(expression, 'index.js');
            }

            // npm.path原文件路径
            obj[npm.path] = {
                expression, // 表达式
                packageName, // 模块名称
                targetId, // 目标模块路径id
            };
            return obj;
        }, {});

        // 查找出更深的 npm 依赖文件
        function lookupDeepDeps() {
            return new Promise((resolve, reject) => {
                const paths = Object.keys(npms);
                if (!paths.length) resolve([]);
                const res = {};
                // 循环 npms path
                vfs.src(paths)
                    .pipe(through2.obj(async (cFile, cEnc, cNext) => {
                        const deepNpms = await lookupDeps(cFile);
                        Object.keys(deepNpms).forEach(key => {
                            deepNpms[key].deep = true;
                        });
                        Object.assign(res, deepNpms);
                        return cNext();
                    }))
                    .on('finish', () => resolve(res))
                    .on('error', reject);
            });
        }

        Object.assign(npms, await lookupDeepDeps());

        // 对于 file.path 是node_modules的内容，通常不会改变，无需再次查找
        if (file.path.replace(/\\/g, '/').split('/')
            .includes('node_modules')) {
            lookupedList[file.path] = npms; // 标记已查找
        }

        return npms;
    }

    // 提取 npm 依赖
    async function extractDeps(file, enc, next) {
        const self = this; // main transform `this`

        // 查找出的该文件所有的 npm 依赖
        let deps = {};
        try {
            deps = await lookupDeps(file);
        } catch (err) {
            return next(new PluginError('mp-helper.cli', err, {
                showProperties: false,
            }));
        }

        const depPaths = Object.keys(deps)
            .filter(depPath =>
                deps[depPath] && deps[depPath].targetId // 过滤出存在合法的依赖
                && !cacheList[depPath]); // 过滤出未处理的依赖

        if (!depPaths.length) return next(null, file);

        // 循环 deps path
        return vfs.src(depPaths)
            .pipe(through2.obj(async (cFile, cEnc, cNext) => {
                const sourcePath = cFile.path; // 源地址
                const depInfo = deps[cFile.path];
                if (!depInfo) return cNext();
                cFile.cwd = file.cwd;
                cFile.base = file.base;
                cFile.path = path.join(file.base, options.targetDir, depInfo.targetId); // 改变路径
                if (self.push) {
                    self.push(cFile);
                    cacheList[sourcePath] = depInfo; // 标记已处理该依赖
                    if (!depInfo.deep) {
                        // 打印信息
                        const outputs = options.outputs || [];
                        outputs.forEach(output => {
                            const relativePath = relative(cFile.path,
                                { cwd: cFile.base });
                            logger.log(`${icons.copy} 依赖`, relative(path.join(output, relativePath)));
                        });
                    }
                }
                return cNext();
            }))
            .on('finish', () => next(null, file))
            .on('error', err => next(new PluginError('mp-helper.cli', err)));
    }

    return through2.obj(extractDeps);
};
