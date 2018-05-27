let http = require('http');
let context = require('./context');
let request = require('./request');
class Koa {
    constructor() {
        this.callbackFn;
        this.context = context;
        this.request = request;
    }

    // 创建上下文对象方法
    createContext(req, res) {
        // 采用Object.create 方法重新创建对象，是为了更改ctx上的属性，不影响其他使用 context 的对象；因为this.context this.request属于引用类型,都是引用外部文件的对象
        // 创建上下文
        let ctx = Object.create(this.context);
        // 创建request
        ctx.request = Object.create(this.request);
        // 将req赋值给ctx.request,是因为rquest.js 文件中的   get query() {
        //                                                     return url.parse(this.req.url, true).query;
        //                                                   } 这个方法，this指的是ctx.request,他没有req属性，所以采用ctx.req = ctx.request.req = req;给他赋上这个属性。
        //
        ctx.req = ctx.request.req = req;
        return ctx;
    }

    // 定义回调函数
    handleRequest() {
        return (req, res) => {
            // 创建上下文对象，createContext方法库里自带
            let ctx = this.createContext(req, res);
            this.callbackFn(ctx);
        }
    }

    listen() {
        let server = http.createServer(this.handleRequest());
        server.listen(...arguments);// 这里不只是传端口，还有其他参数，比如callbalk
    }
    use(fn) {
        this.callbackFn = fn;
    }
}

module.exports = Koa;