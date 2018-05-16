let fs = require('fs');
let path = require('path');
let ReadStream = require('./readStream');
let WriteStream = require('./writeStream');
// 主要功能 ：读取一点，写入一点
let rs = new ReadStream(path.join(__dirname, '1.txt'), {
  highWaterMark: 4
});
let ws = new WriteStream(path.join(__dirname, '2.txt'), {
  highWaterMark: 1
});

//----读取一点写入一点的方法；
rs.pipe(ws);






















//-----------------------------------------------使用
// let rs = fs.createReadStream(path.join(__dirname, '1.txt'), {
//   highWaterMark: 4
// });

// let ws = fs.createWriteStream(path.join(__dirname, '2.txt'), {
//   highWaterMark: 1
// });

//--------源码实现读取一点写入一点
// rs.on('data', (chunk) => {// chunk读取到的东西
//   let flag = ws.write(chunk);
//   if (!flag) { // 如果写入的缓存区达到水平上线，就先停止文件读取。
//     rs.pause();
//   }
// });

// ws.on('drain', () => { // 缓存区抽干后恢复读取功能
//   rs.resume();
// });