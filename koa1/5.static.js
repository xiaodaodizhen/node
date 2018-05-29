let Koa = require('koa');
let app = new Koa();
// let static = require('koa-static');
let path = require('path');

let fs = require('fs');
let util = require('util');
let mime = require('mime');
let stat = util.promisify(fs.stat);


// -----------------源码实现 koa-static 开始

function static(p) {
  return async (ctx, next) => {
    try {
      let page = path.join(p, ctx.path);
      let statObj = await stat(page);
      if (statObj.isDirectory()) {

      } else {
        ctx.set('Content-Type', mime.getType(page) + ';charset=utf8');
        ctx.body = fs.createReadStream(page);
      }
    } catch (e) {
      await next();
    }
  }
}

// -----------------源码实现 koa-static 结束




app.use(static(path.join(__dirname, 'public')));
app.use(async (ctx, next) => {
  ctx.body = "not Found"
});
app.listen(8000);