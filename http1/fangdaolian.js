// 图片防盗链-------------根据当前请求头的referer 来判断。

let fs = require('fs');
let path = require('path');
let url = require('url');
let http = require('http');

// 获取主机名
let getHostName = (refer) => {
  let { hostname } = url.parse(refer);  // 解析主机名，此处用到了{hostname}对象解构
  return hostname;
}

let server = http.createServer((req, res) => {
  let refer = req.headers['referer'] || req.headers['referrer'];// referer、referrer两种写法，处理浏览器兼容，一般使用第一个referer，代表内容来源
  // 先看refer的值，然后看图片的请求路径
  // 要读取文件返回客户端

  let { pathname } = url.parse(req.url, true);
  // p代表要找的文件
  let p = path.join(__dirname, 'public', '.' + pathname);
  fs.stat(p, (err) => {  // 文件存在
    if (!err) {
      if (refer) { // 图片在其他站点中被使用了
        let referHostName = getHostName(refer);
        let host = req.headers['host'].split(':')[0]; // locahost:8080  取的是localhost，代表的是当前文件的额主机名
        if (referHostName != host) {
 
          // 白名单里的可以，补充代码---------------------------------------------------------


          // 防盗链
          fs.createReadStream(path.join(__dirname, 'public', './2.jpg')).pipe(res);
        } else {
          // 正常显示数据图
          fs.createReadStream(p).pipe(res);
        }
      } else {
        //正常显示
        fs.createReadStream(p).pipe(res);
      }
    } else {// 文件不存在
      res.end();
    }
  });

});
server.listen(9999);