// 将微信原生 api 转换为 promise 方法
function promiser(fn) {
    // eslint-disable-next-line func-names
    return function (...args) {
        const options = args[0] || {};
        return new Promise((resolve, reject) => fn({
            ...options,
            // `success` 属性对应 `resolve`
            success(...ress) {
                options.success && options.success(...ress);
                resolve(...ress);
            },
            // `fail` 属性对应 `reject`
            fail(...errors) {
                options.fail && options.fail(...errors);
                // eslint-disable-next-line prefer-promise-reject-errors
                reject(...errors);
            }
        }));
    };
}

export default promiser;
