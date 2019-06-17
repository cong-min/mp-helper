const pumpify = require('pumpify');
const loader = require('./loader');
const extractDeps = require('./extractDeps');

// pipeline
module.exports = (options = {}) => {
    const pipeline = [
        loader(options),
        options.extractDeps ? extractDeps(options) : null,
    ].filter(Boolean);

    return pipeline.length === 1 ? pipeline[0] : pumpify.obj(pipeline);
};
