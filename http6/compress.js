// Content-Encoding:gzip  服务端返回的响应头

// Accept-Encoding:gzip, deflate,br 客户端的请求头

let fs = require('fs');
let path = require('path');
let zlib = require('zlib');
// ------------------------------------------压缩
// function zip(src) {
//   let gzip = zlib.createGzip();
//   fs.createReadStream(src).pipe(gzip).pipe(fs.createWriteStream(src + '.gz'));
// }

// zip(path.join(__dirname, 'gu.txt'));

// ------------------------------------------解压

function unzip(src) {
  let gunzip = zlib.createGunzip();
  fs.createReadStream(src).pipe(gunzip).pipe(fs.createWriteStream(path.basename(src, '.gz')));
}

unzip(path.join(__dirname, 'gu.txt.gz'));