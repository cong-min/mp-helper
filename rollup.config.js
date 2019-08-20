// rollup.config.js
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import cleanup from 'rollup-plugin-cleanup';

const { version } = require('./package.json');

const banner = `/* mp-helper v${version}\n`
    + ' * https://github.com/mcc108/mp-helper\n'
    + ' */';

export default [{
    output: 'dist/mp-helper.js',
    format: 'esm',
}, {
    output: 'dist/mp-helper.common.js',
    format: 'cjs',
}].map(({ output, format }) => ({
    input: 'lib/core/index.js',
    output: {
        name: 'mp',
        file: output,
        format,
        banner,
    },
    plugins: [
        resolve(),
        commonjs(),
        json(),
        cleanup(),
    ]
}));
