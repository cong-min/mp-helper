import urlString from '../utils/urlString';

// 将小程序原生的 query 转换为合理的对象
function parseQuery(query) {
    let querystring = urlString.qs.stringify(query);
    querystring = decodeURIComponent(querystring);
    return urlString.qs.parse(querystring);
}

// 注入路由
function injectRoute(args) {
    if (this.$constructor === 'Page') {
        let query = args[0] || {};
        if (Object.keys(query).length) query = parseQuery(query);
        args[0] = this.options = query; // 重写 page options
        const route = this.route || this.__route__;
        this.$route = {
            path: route && !/^\//.test(route) ? `/${route}` : route,
            query,
            webViewId: this.__wxWebviewId__,
        };
    } else {
        this.$route = this.$page.$route;
    }
}

export default {
    injectRoute,
};
