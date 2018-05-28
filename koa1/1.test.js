// let Koa = require('koa');
let Koa = require('./koa/application');
let app = new Koa();
app.listen(3000);

// app.use((req, res) => {
//     res.end('ddd');
// });

app.use((ctx) => {
    // console.log(ctx.query);
    // console.log(ctx.request.query);
    ctx.response.body = "1";
    console.log(ctx.response.body);
});
