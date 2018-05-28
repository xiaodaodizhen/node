
let Koa = require('koa');
let bodybetterbody = require('koa-better-body');
let path = require('path');
let app = new Koa();
app.listen(3000);

// ***************** 实现bodybetterbody源码开始

function bodybetterbody(options = {}) {
  let uploadDir = options;
  return async (ctx, next) => {
    await new Promise((reslove, reject) => {
      let buffers = [];
      ctx.req.on('data', (data) => {
        buffers.push(data);
      });
      ctx.req.on('end', () => {
        let data = Buffer.concat(buffers).toString();
        // data 中含有上传的文件，所以涉及到buffer的解析
        reslove();
      });
    });
    await next();
  }
}

// ***************** 实现bodybetterbody源码结束

app.use(bodybetterbody({ // 使用 koa-better-body 库时，需要配置文件上传路径
  uploadDir: path.join(__dirname, 'upfile')
}));

app.use(async (ctx, next) => {
  if (ctx.path === '/user' && ctx.method === "GET") {
    // 需要上传文件的时候 需要配置enctype='multipart/form-data
    // 需要上传多个文件的时候 需要配置   multiple="multiple" 
    ctx.body = (`
      <form method ='POST' enctype='multipart/form-data'>
        <input type='text' name ='username'>
        <input type='file' name ='files'  multiple="multiple" >
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
    ctx.body = ctx.request.fields;
  }
});
