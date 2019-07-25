import urlString from '../utils/urlString';

// 将小程序原生的 query 转换为合理的对象
function parseQuery(query) {
    let querystring = urlString.qs.stringify(query);
    querystring = decodeURIComponent(querystring);
    return urlString.qs.parse(querystring);
}

// 判断是否为组件化页面 (即利用 Component 构造页面)
function isComponentPage(self) { return self && self === self.$page; }


// 计算路由
function computeRoute(query) {
    if (Object.keys(query).length) query = parseQuery(query);
    const route = this.route || this.__route__;
    return {
        path: route && !/^\//.test(route) ? `/${route}` : route,
        query,
        webViewId: this.__wxWebviewId__,
    };
}

// 注入路由 (构建页面时在 onLoad 时调用)
function injectRoute(args) {
    if (this.$constructor === 'Page' // 标准 Page 路由
        || (this.$constructor === 'Component' && isComponentPage(this)) // Component 构造页面
    ) {
        if (!args) return;
        this.$route = computeRoute.call(this, args[0] || {});
        args[0] = this.options = this.$route.query; // 重写 page options
    } else {
        Object.defineProperty(this, '$route', {
            enumerable: true,
            get: () => this.$page.$route
                || computeRoute.call(this.$page, this.$page.options || {}),
        });
    }
}

export default {
    injectRoute,
};
