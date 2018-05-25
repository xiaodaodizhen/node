let http = require('http');
let path = require('path');
let fs = require('fs');
let zlib = require('zlib');
// Accept-Encoding:gzip, deflate,br 客户端的请求头
let server = http.createServer((req, res) => {
  let p = path.join(__dirname, 'xg.txt');
  let header = req.headers['accept-encoding'];
  if (header) {
    if (header.match(/\bgzip\b/)) {
      let gzip = zlib.createGzip();
      res.setHeader({ 'Content-Encoding': 'gzip' });
      fs.createReadStream(p).pipe(gzip).pipe(res);
    } else if (header.match(/\bdeflate\b/)) {
      let deflate = zlib.createDeflate();
      res.setHeader({ 'Content-Encoding': 'deflate' });
      fs.createReadStream(p).pipe(deflate).pipe(res);
    } else {
      fs.createReadStream(p).pipe(res);
    }
  }
  res.setHeader({'Content-type':'application/json; charset=UTF-8'});
});