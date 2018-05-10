let fs = require('fs');
let path = require('path');
// 自定义copy 方法，但是过于站内存。
// function copy(source, target) {
//   fs.readFile(path.join(__dirname, source), (err, data) => {
//     if (err) return console.log("err:" + err);
//     fs.writeFile(path.join(__dirname, target), data, (err) => {
//       if (err) return console.log("err1：" + err);
//     });
//   });
// }
// copy('1.txt', '2.txt');


/**
 * coypFile() 
 * node 版本8.5+
 * 拷贝的文件有大小限制，兼容存在问题
 * 
 */
fs.copyFile(path.join(__dirname, '1.txt'), path.join(__dirname, '2.txt'), (err) => {
  if (err) return console.log(err);
  console.log('拷贝成功');
});


