let fs = require('fs');
let path = require('path');
let rs = fs.createReadStream(path.join(__dirname, '1.txt'), {
  highWaterMark: 3
});
// 当我只要创建一个流，就会先把缓存区填满，等待自己消费
// 如果当前缓存区被清空（消费）后会再次出发readable事件，
// 当缓存个数小于 缓存区定制的上线水平后，会自动向缓存区在添加  highWaterMark 的个数数据。
rs.on('readable', () => {
  let result = rs.read(1);
  console.log(rs._readableState.length);// 缓存区个数
});