// koa 自己封装的

let url = require('url');
// 内部使用了get  set 方法
let request = {
    get query() {
        return url.parse(this.req.url, true).query;
    },
    get method() {
        return this.req.method;
    }
}
module.exports = request;