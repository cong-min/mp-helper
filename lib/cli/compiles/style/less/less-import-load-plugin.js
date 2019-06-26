const { FileManager, fs } = require('less');
const resolveFrom = require('resolve-from');

// 指定地址，正确的解析 less 中 import 的路径
function lessImportLoadPlugin() {
    class ImportFileManager extends FileManager {
        // 对所有的文件都支持
        supports() { return true; }

        // 不支持异步路径
        supportsSync() { return false; }

        loadFile(filename, currentDirectory, options, environment, callback) {
            const self = this;
            return new Promise(async (resolve, reject) => {
                /* 先尝试使用 less 原生 loadFile 加载文件 */
                // eslint-disable-next-line prefer-rest-params
                super.loadFile.apply(self, arguments).then(resolve)
                    .catch(() => {
                        /* 如果失败再使用新的 loadFile 方案 */
                        // 不加 ext 尝试解析地址
                        let fullFilename = resolveFrom.silent(currentDirectory, filename);
                        // 如果没有，再加上 ext 尝试解析地址
                        if (!fullFilename) {
                            const extFilename = self.tryAppendExtension(filename, options.ext);
                            fullFilename = resolveFrom.silent(currentDirectory, extFilename);
                        }
                        // 如果仍然没有，则以 filename 作为 fullFilename
                        if (!fullFilename) fullFilename = filename;

                        const readFileArgs = [fullFilename];

                        if (!options.rawBuffer) { readFileArgs.push('utf-8'); }

                        readFileArgs.push((err, data) => {
                            if (err) {
                                // eslint-disable-next-line prefer-promise-reject-errors
                                return reject({
                                    type: 'File',
                                    message: `${filename} wasn't found.`
                                });
                            }
                            return resolve({
                                contents: data,
                                filename: fullFilename
                            });
                        });

                        fs.readFile.apply(this, readFileArgs);
                    });
            });
        }
    }

    return {
        install(lessInstance, pluginManager) {
            pluginManager.addFileManager(new ImportFileManager());
        },
        minVersion: [3, 8, 0],
    };
}

module.exports = lessImportLoadPlugin;
