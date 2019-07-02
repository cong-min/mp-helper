import urlString from '../utils/urlString';

// 将小程序原生的 query 转换为合理的对象
function parseQuery(query) {
    let querystring = urlString.qs.stringify(query);
    querystring = decodeURIComponent(querystring);
    return urlString.qs.parse(querystring);
}

// 判断是否为组件化页面 (即利用 Component 构造页面)
function isComponentPage(self) { return self && self === self.$page; }

// 注入路由 (构建页面时在 onLoad 时调用)
function injectRoute(args) {
    if (this.$constructor === 'Page' // 标准 Page 路由
        || (this.$constructor === 'Component' && isComponentPage(this)) // Component 构造页面
    ) {
        if (!args) return;
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
