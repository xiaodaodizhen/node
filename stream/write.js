let fs = require('fs');
let path = require('path');
let WriterStream = require('./writeStream');
// 如果要写入的文件目录不存在，不会报错，会自动创建一个相应文件目录的文件。如果在写入之前有内容，写入后把以前的内容清空
// 第一次是真的往文件里写，后面的都会放到缓存区中，过一会写会写入去清空缓存区。
// let ws = fs.createWriteStream(path.join(__dirname, 'write.txt'), {
let ws = new WriterStream(path.join(__dirname, 'write.txt'), {
  highWaterMark: 3, // 默认是16k
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
    flag = ws.write(--i + '', 'utf8', () => {// 第一个参数，是写入的内容，必须是buffer或string，是异步方法
      // --i+''  表示写入的是一个字符串类型的数据
    });

    // flag 表示当前是否满了。
    //  可读流一般配合可写流，
    console.log(flag);
  }
}
// drain 事件，只有当缓存区充满后并且被消费（把内容抽出，写入磁盘）后才触发，也可以说是嘴塞满了，然后吃完了在被触发。
ws.on('drain', () => {
  console.log('抽出');
  write();
});
write();