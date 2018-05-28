

//--------------- 需求1： 当访问/user 的时候，显示一个可以提交的表单； 当提交后，提交到/user上去，并且方法是post



// 方法一：
// let Koa = require('koa');
// let app = new Koa();
// app.listen(3000);

// app.use(async (ctx, next) => {
//   if (ctx.path === '/user' && ctx.method === "GET") {
//     ctx.body = (`
//       <form method ='POST'>
//         <input type='text' name ='username'>
//         <input type='submit'>
//       </form>
//    `);
//   } else {
//     await next()
//   }
// });

// app.use(async (ctx, next) => {
//   if (ctx.path === '/user' && ctx.method === "POST") {
//     // 接收请求体，将请求体的结果显示到页面上 
//     // 注意：如果有异步方法，一定要写成promise，
//     let data = await bodyParser(ctx);
//     ctx.set('Content-Type', 'text/html;chart=utf8');
//     ctx.body = data;
//   }
// });
// // -----koa-bodyparser 第三方库可以代替一下代码
// function bodyParser(ctx) {
//   return new Promise((reslove, reject) => {
//     let buffers = [];
//     ctx.req.on('data', (data) => {
//       buffers.push(data);
//     });
//     ctx.req.on('end', () => {
//       reslove(Buffer.concat(buffers).toString());
//     });
//   });
// }



//--------------------- 方法二 ---------------------------------------------------使用 koa-bodyparser 库

let Koa = require('koa');
// let bodyparser = require('koa-bodyparser');
let app = new Koa();
app.listen(3000);


// ---- 模仿 koa-bodyparser 库源码开始
function bodyparser(ctx) {
  return async (ctx, next) => {
    await new Promise((reslove, reject) => {
      let buffers = [];
      ctx.req.on('data', (data) => {
        buffers.push(data);
      });
      ctx.req.on('end', () => {
        ctx.request.body = Buffer.concat(buffers).toString(); // 在request属性上增加一个body属性并且赋值   ------备注，也可以增加别的变量入body4,, 也可以赋值到外部的变量上入dataResult,然后所需处直接饮用
        reslove();
      });
    });
    await next();
  }
}
// --------------模仿 koa-bodyparser 库源码结束

app.use(bodyparser());//会在一个请求request上增加一个body属性,将请求体赋值在body属性上，获取请求体，只需要  ctx.request.body


app.use(async (ctx, next) => {
  if (ctx.path === '/user' && ctx.method === "GET") {
    ctx.body = (`
      <form method ='POST'>
        <input type='text' name ='username'>
        <input type='submit'>
      </form>
   `);
  } else {
    await next()
  }
});

app.use(async (ctx, next) => {
  if (ctx.path === '/user' && ctx.method === "POST") {
    // 接收请求体，将请求体的结果显示到页面上 
    // 注意：如果有异步方法，一定要写成promise，
    ctx.set('Content-Type', 'text/html;chart=utf8');
    ctx.body = ctx.request.body;
  }
});
