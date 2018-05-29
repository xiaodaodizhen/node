// let Koa = require('koa');
let Koa = require('./koa/application');
let app = new Koa();
app.listen(3000);

// app.use((req, res) => {
//     res.end('ddd');
// });

app.use(async (ctx, next) => {
    // console.log(ctx.query);
    // console.log(ctx.request.query);
    ctx.response.body = "1";
    console.log(ctx.response.body);
    await next();
});
app.use(async (ctx, next) => {
    ctx.response.body = "4";
    console.log(ctx.response.body);
    ctx.body = '3';

    // ctx.response.body  === ctx.body   如果重复赋值会以最后一次为准，多个app.use 里重复也是以最后一次为准
    await next();
});

// --------------------------------------------------------错误监听
// app.use(async (ctx, next) => {
//     throw Error('出错');
// });

// app.on('error', (e) => {
//     console.log(e);
// });