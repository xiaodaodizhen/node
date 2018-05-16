// transform 流  ---  转换流

let { Transform } = require('stream');
// 他的参数和可写流一样
let transform1 = Transform({
  transform(chunk, encoding, callback) {
    this.push(chunk.toString().toUpperCase);//将输入的内容放到可读流中
    callback();
  }
});

let transform2 = Transform({
  transform(chunk, encoding, callback) {
    console.log(chunk.toString());
    callback();
  }
});

// process.stdin 等待你输入
// 希望将输入的内容转换成大写在输出出来
process.stdin.pipe(transform1).pipe(transform2);



//-------------------------本代码运行出错，布吉岛为啥，布吉岛为啥，布吉岛为啥！！