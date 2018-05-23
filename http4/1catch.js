// 对比缓存（根据最新修改时间）：  需要每次请求的时候（弊端，时间是精确到秒，如果在一秒内更改了就不会比较出结果，不会获取新的内容），对比下

// let http = require('http');
// let fs = require('fs');
// let path = require('path');
// let url = require('url');
// let mime = require('mime');// 获取文件类型库    mime.getType(p) 根据文件获取文件的后缀名

// let server = http.createServer((req, res) => {
//   // 获取/index.html
//   let { pathname } = url.parse(req.url);
//   // 拼接绝对路径
//   let p = path.join(__dirname, 'public', '.' + pathname);
//   fs.stat(p, (err, stat) => {
//     // 第一次来的时候给一个标识，下次再来的时候会带上一个标识('Last-Modified'响应头里的这个属性)
//     // 这次你来的时候我用我的标识（stat.ctime.toUTCString()）和你的比一下，如果有区别就返回新的文件

//     // 根据修改时间判断，
//     // if-modified-since(请求头里的属性)  Last-Modified(相应头的属性)

//     if (!err) {

//       let since = req.headers['if-modified-since'];
//       if (since) {
//         if (since === stat.ctime.toUTCString()) { // 如果相等那就是文件在这段时间内未做修改，匹配的是文件的修改时间，直接缓存中取
//           res.statusCode = 304;
//           res.end();
//         } else {// 如果不相等，那证明文件已经修改了，就得从从服务器去拉取 
//           sendFile(res, req, p, stat);
//         }
//       } else {// 如果没有，就代表是第一次访问，直接从服务器拉数据
//         sendFile(res, req, p, stat);
//       }

//     } else {
//       sendError(res);
//     }

//   });
// });

// sendFile = (res, req, p, stat) => {
//   res.setHeader('Last-Modified', stat.ctime.toUTCString());
//   res.setHeader('Content-Type', mime.getType(p) + ";charset=utf8");// 浏览器默认的编码是gbk2312
//   fs.createReadStream(p).pipe(res);
// }
// sendError = (res) => {
//   res.statusCode = 404;
//   res.end();
// }

// server.listen(8080);





// 对比缓存（根据最新的内容修改）

let http = require('http');
let fs = require('fs');
let path = require('path');
let url = require('url');
let mime = require('mime');// 获取文件类型库    mime.getType(p) 根据文件获取文件的后缀名

let crypto = require('crypto');

let server = http.createServer((req, res) => {
  // 获取/index.html
  let { pathname } = url.parse(req.url);
  // 拼接绝对路径
  let p = path.join(__dirname, 'public', '.' + pathname);
  fs.stat(p, (err, stat) => {
    // 根据md5摘要判断，如果有更改，多得的md5会不一样，如果一样就是未进行更改，
    // if-none-match(请求头里的属性) 

    let md5 = crypto.createHash('md5');
    let rs = fs.createReadStream(p);
    rs.on('data', (chunk) => {
      md5.update(chunk);
    });
    rs.on('end', () => {
      let r = md5.digest('hex');// 加密结果是当前文件的唯一标识

      // 下次再拿最新文件的摘要值和客户端请求来比较
      let ifNoneMatch = req.headers['if-none-match'];
      if (ifNoneMatch) {
        if (ifNoneMatch === r) {
          res.statusCode = 304;
          res.end();
        } else {
          sendFile(res, req, p, r);
        }
      } else {
        sendFile(res, req, p, r);
      }

    });
  });
});

sendFile = (res, req, p, r) => {
  res.setHeader('Etag', r);
  res.setHeader('Content-Type', mime.getType(p) + ";charset=utf8");// 浏览器默认的编码是gbk2312
  fs.createReadStream(p).pipe(res);
}
sendError = (res) => {
  res.statusCode = 404;
  res.end();
}

server.listen(8080);











// 强制缓存  设置两个头(第一次访问的时候走服务器，在一段时间后就都不走服务器了)
// Expries 过期时间http1.0 的产物，为了兼容设置上，设置的是绝对时间  例如：Expires: Thu, 18 May 2028 06:24:51 GMT
// Cache-Control 相对时间http1.1的产物    例如：max-age=315360000

// 当访问localhost:8080/index.html
// let http = require('http');
// let fs = require('fs');
// let path = require('path');
// let url = require('url');
// let mime = require('mime');// 获取文件类型库    mime.getType(p) 根据文件获取文件的后缀名

// let server = http.createServer((req, res) => {
//   // 获取/index.html
//   let { pathname } = url.parse(req.url);
//   // 拼接绝对路径
//   let p = path.join(__dirname, 'public', '.' + pathname);
//   fs.stat(p, (err, stat) => {
//     if (!err) {
//       sendFile(res, req, p);
//     } else {
//       sendError(res);
//     }
//   });
// });

// sendFile = (res, req, p) => {
//   let date = new Date(Date.now() + 10 * 1000);
//   res.setHeader('Expires', date.toUTCString());
//   res.setHeader('Cache-Control', 'max-age=10');
//   res.setHeader('Content-Type', mime.getType(p) + ";charset=utf8");// 浏览器默认的编码是gbk2312
//   fs.createReadStream(p).pipe(res);
// }
// sendError = (res) => {
//   res.statusCode = 404;
//   res.end();
// }

// server.listen(8080);