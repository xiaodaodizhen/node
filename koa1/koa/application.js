let http = require('http');
let context = require('./context');
let request = require('./request');
let response = require('./response');
let stream = require('stream');
let EventEmitter = require('events');
class Koa extends EventEmitter { // 继承事件类，是为了捕获错误后，发送错误信息
    constructor() {
        super();
        this.callbackFn;
        this.middlewares = [];
        this.context = context;
        this.response = response;
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
        ctx.response = Object.create(this.response);
        ctx.req = ctx.request.req = req;
        ctx.res = ctx.response.res = res;
        return ctx;
    }
    // koa 代码实现 app.use 中的next 的主要代码
    compose(ctx, middlewares) {
        function dispatch(index) {
            let middleware = middlewares[index];
            if (middlewares.length == index) return Promise.resolve();
            return Promise.resolve(middleware(ctx, () => dispatch(index + 1)));// 这里回调函数 () => dispatch(index + 1))实质上是 app.use(async (ctx,next)=>{})的next
        }
        return dispatch(0);
    }

    // 定义回调函数
    handleRequest() {
        return (req, res) => {
            // 创建上下文对象，createContext方法库里自带
            res.statusCode = 404;
            let ctx = this.createContext(req, res);

            // 组合后的中间件，而且是一个promise
            let composeMiddleWare = this.compose(ctx, this.middlewares);

            composeMiddleWare.then(function () {
                let body = ctx.body;
                // body 是流的情况
                if (body instanceof stream) {
                    return body.pipe(res); // 通过管道 将流内容输出到页面上
                }
                // body是对象的情况
                if (typeof body === "object") {
                    return res.end(JSON.stringify(body)); // 将对象转换为字符串，输出到页面上
                }

                // 没有赋值的情况
                if (body == undefined) {
                    return res.end('not found');// 当函数执行结束后并向页面赋值
                }
                // body是普通数据类型的情况
                res.end(body);
            }).catch((err) => {// 捕获错误，然后发送事件，
                this.emit('error', err);
                res.end();
            });
        }
    }

    listen() {
        let server = http.createServer(this.handleRequest());
        server.listen(...arguments);// 这里不只是传端口，还有其他参数，比如callbalk
    }
    use(fn) {
        // this.callbackFn = fn;
        this.middlewares.push(fn);
    }
}

module.exports = Koa;