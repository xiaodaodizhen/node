
let Koa = require('koa');
// let bodybetterbody = require('koa-better-body');
let path = require('path');
let app = new Koa();
app.listen(3000);

//----------------buffer split 方法实现开始
Buffer.prototype.split = function (sep) {
  let index = 0;
  let len = Buffer.from(sep).length;
  let i = 0;
  let arr = [];
  while (-1 !== (i = this.indexOf(sep, index))) {
    let a = this.slice(index, i);
    index = i + len
    arr.push(a);
  }
  arr.push(this.slice(index));
  return arr.map(item => item.toString());
}
//----------------buffer split 方法实现结束


// ***************** 实现bodybetterbody源码开始-------------------------------------结合《 koa-better-body .jpg 》解析图理解

function bodybetterbody(options = {}) {
  let uploadDir = options.uploadDir;
  return async (ctx, next) => {
    await new Promise((reslove, reject) => {
      let buffers = [];
      ctx.req.on('data', (data) => {
        buffers.push(data);
      });
      ctx.req.on('end', () => {
        // 通过content-type 的值查看是否是含有上传文件   ----   返回值：multipart/form-data; boundary=----WebKitFormBoundaryEmPzPOyYT4uk8CLc
        let type = ctx.get('content-type');
        // 将buffer数组进行拼接
        let buff = Buffer.concat(buffers);

        let files = {};

        if (type.includes('multipart/form-data')) {// 多form格式（包含上传文件）
          // 拼接分割线  拼接为"----WebKitFormBoundarykyFwognIRz20ZOjQ"
          let sep = '--' + type.split('=')[1];
          // 将buffer字符串用sep 分割为数组
          let lines = buff.split(sep).slice(1, -1);

          lines.forEach((e) => {
            let [head, content] = e.split('\r\n\r\n');
            head = head.slice(2).toString();
            content = content.slice(0, -2);// 本content只是对一般的表单准确，，对文件上传表单取的内容不准确，文件上传的真实内容可能包含多个\r\n\r\n，所以通过这方法取出的内容不准确
            let [, name] = head.match(/name="(.*)"/);//----------------------??????/
            if (head.includes('filename')) {// 上传的文件
              // 由于上面content取出的内容可能不准确， 应该取除了head部分+三个 \r\n 总共长度为6   的所有部分。
              let c = lines.slice(head.length + 6);
              // 文件随机名字并安排目录
              let p = path.join(uploadDir, Math.random().toString());
              // 将内容写入到文件中，文件中的内容全是buffer
              require('fs').writeFileSync(p, c);

              files[name] = [{ path: p }];

            } else {
              files[name] = content.toString();
            }
          });

        } else if (type == "application/x-www-form-urlencoded") { // 普通表单请求体
          // 提交格式： a=2&&b=5;
          files = require('querystring').parse(buff.toString());
        } else if (type == "application/json") { // JSON 请求体
          files = JSON.parse(buff.toString());
        } else {// 普通字符串 为请求体
          files = buff.toString();
        }
        ctx.request.fields = files;
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
    
    //------带有文件上传功能的表单
    // 需要上传文件的时候 需要配置enctype='multipart/form-data
    // 需要上传多个文件的时候 需要配置   multiple="multiple" 
    //   ctx.body = (`
    //     <form method ='POST' enctype='multipart/form-data'>
    //       <input type='text' name ='username'>
    //       <input type='text' name ='userpassword'>
    //       <input type='file' name ='files'  multiple="multiple" >
    //       <input type='submit'>
    //     </form>
    //  `);

    //-------普通表单请求
    ctx.body = (`
   <form method ='POST'>
     <input type='text' name ='username'>
     <input type='text' name ='userpassword'>
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
