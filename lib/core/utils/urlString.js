import qs from 'qs';

// urlString.stringify
function stringify(url, query) {
    return `${url}?${qs.stringify(query)}`;
}

// urlString.parse
function parse(urlString) {
    const hashStart = urlString.indexOf('#');
    if (hashStart !== -1) urlString = urlString.slice(0, hashStart); // remove hash
    const url = urlString.split('?')[0] || ''; // url base

    const queryStart = urlString.indexOf('?');
    const querystring = queryStart !== -1 ? urlString.slice(queryStart + 1) : '';

    const query = qs.parse(querystring); // query object

    return { url, query };
}

// urlString
export default {
    stringify,
    parse,
    qs,
};
