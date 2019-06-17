// rollup.config.js
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';

export default [
    // esm
    {
        input: 'lib/helper/index.js',
        output: {
            name: 'mp',
            file: 'dist/mp-helper.js',
            format: 'esm'
        },
        plugins: [
            resolve(),
            commonjs(),
            json()
        ]
    },
    // cjs
    {
        input: 'lib/helper/index.js',
        output: {
            name: 'mp',
            file: 'dist/mp-helper.common.js',
            format: 'cjs'
        },
        plugins: [
            resolve(),
            commonjs(),
            json()
        ]
    }
];
