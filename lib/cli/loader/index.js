const mp = require('./mp');

// loader rules
exports.rules = [
    {
        test: /\.mp$/,
        use: [mp],
    },
];
