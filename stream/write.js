let fs = require('fs');
let path = require('path');
let WriterStream = require('./writeStream');
// 如果要写入的文件目录不存在，不会报错，会自动创建一个相应文件目录的文件。
// let ws = fs.createWriteStream(path.join(__dirname, 'write.txt'), {
let ws = new WriterStream(path.join(__dirname, 'write.txt'), {
  highWaterMark: 3,
  autoClose: true,
  flags: 'w',
  encoding: 'utf8',
  mode: 0o666,
  start: 0
});


let i = 9;
function write() {
  let flag = true;
  while (i >= 0 && flag) {
    flag = ws.write(--i + '', 'utf8', () => {
      // --i+''  表示写入的是一个字符串类型的数据
    });
    console.log(flag);
  }
}
// drain 事件，只有当缓存区充满后并且被消费（把内容抽出，写入磁盘）后才触发。
ws.on('drain', () => {
  console.log('抽出');
  write();
});
write();