let Koa = require('koa');
let app = new Koa();
app.listen(3000);


// ctx 代表的是上下文，是koa自己创建的
// ctx.request 是koa自己封装的request属性
// ctx.response 是koa自己封装的response属性
// ctx.req 是原生的req对象
// ctx.res 是原生的res对象
// ctx有代理的作用
app.use((ctx, next) => {
    console.log(ctx.url, ctx.request.url);
    console.log(ctx.method, ctx.request.method);
    console.log(ctx.query, ctx.request.query); // query
    console.log(ctx.path, ctx.request.path); // pathname
    ctx.body = 'helddlo';
    ctx.body = 'helddlosdfsfsd';// 可以调用多次，只是以最后一次为准
});


//*****************ctx只是用来实现代理req的 */