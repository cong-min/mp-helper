// parse attrs
module.exports = attrs => {
    attrs = Array.isArray(attrs) ? attrs : [];
    return attrs.reduce((obj, { name, value }) => {
        if (!name) return obj;
        obj[name] = value;
        return obj;
    }, {});
};
