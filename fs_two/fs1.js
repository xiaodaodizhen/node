//fileSystem 文件系统,包含同步和异步方法。
// readFileSync readFile

// 异步的就多了一个callBack(err,data)

let fs = require('fs');
let path = require('path');
// 同步性能低，会阻塞主线程。能异步就选择异步。
// 读取文件的时候默认编码是null ，null代表的是二进制。 
// fs.readFile(path.join(__dirname, '1.txt'), { flag: 'r' }, (err, data) => {
//   if (err) return console.log(err);
//   return console.log(data);
// })

// 文件中存的永远是二进制,encoding 默认值是utf8
// fs.writeFile(path.join(__dirname,'1.txt'),'h信息ello',{encoding:'utf8'});

// mode 权限
// 0o666 表示可读可写   0o开头的是8进制
// chmod -R 777 *
// fs.writeFile(path.join(__dirname,'1.txt'),'h信息ello',{mode:0o666});

// 命令行  ls -l   获取全部文件的详情信息    ls -l 文件名   获取某个文件的具体信息
// console.log(__filename);


//------------------------------如果要实现拷贝大文件，以上的操作都会造成内存过大的情况。

