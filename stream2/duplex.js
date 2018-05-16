let { Duplex } = require('stream');
// 双工流  既能读也能写，而且互不干扰。
// class d extends Duplex {
//   _read() {

//   }
//   _write() {

//   }
// }

//----------------以上方法简写，在stream做了兼容处理，可以传参

let d = Duplex({
  read() {
    this.push('hello');
    this.push(null);// 写入遇见null就会停止
  },
  write(chunk, encoding, callback) {
    console.log(chunk);
    callback();
  }
});
d.on('data', (data) => {
  console.log(data);
});
d.write('33344');