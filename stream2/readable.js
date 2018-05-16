let fs = require('fs');
let path = require('path');
let ReadStream = require('./readSteam');
// let rs = fs.createReadStream(path.join(__dirname, './1.txt'), {
let rs = new ReadStream(path.join(__dirname, './1.txt'), {
  flags: 'r',
  encoding: 'utf8',
  start: 0,
  mode: 0o666,
  autoClose: true,
  // end: 6,
  highWaterMark: 4
});
// 默认先把缓存区填满； 当缓存区为空时，默认再去触发readable;
// 如果缓存区内容的个数小于highWaterMark，会在去读取并添加进缓存区
rs.on('readable', () => {
  //  let result = rs.read(); read方法内不传参数，默认全部读取缓存区的内容
  let result = rs.read(3);
  console.log(result);
  // console.log(rs._readableState.length);
  console.log(rs.length)
  setTimeout(() => {
    // console.log(rs._readableState.length);
    console.log(rs.length);
  }, 1000);
});