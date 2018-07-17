let fs = require('fs');
let path = require('path');
// 自定义copy 方法，但是过于占内存。
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
// fs.copyFile(path.join(__dirname, '1.txt'), path.join(__dirname, '2.txt'), (err) => {
//   if (err) return console.log(err);
//   console.log('拷贝成功');
// });

/**
 * 《读取》
 * 
 * 限制读取个数，手动读取
 * read()
 * fs.open() 打开文件，先要打开文件，才能对文件进行操作
 * fd :file descriptor 文件描述符，他代表对当前文件的描述---对应的值是3
 * 
 * process.stdin.write() :标准输入 --0
 * process.stdout.write() :标准输出--1
 * process.stderr.error() :错误输出--2
 * 
 */
let buffer = Buffer.alloc(3);
fs.open(path.join(__dirname, '1.txt'), 'r', 0o666, (err, fd) => {
  /**
   * 参数：
   * offset 表示的是buffer从哪个开始存储
   * length 表示一次想读几个
   * postion  代表的是文件的读取位置，默认可以写null 代表当前从0开始
   * length 的长度不能大于buffer的长度
   * 
   * bytesRead 实际读到的个数
   */

  fs.read(fd, buffer, 0, 3, 0, (err, bytesRead) => {
    console.log(err, bytesRead,buffer);
  });
})



/**
 * 写入
 * 
 */




/**
 * copy 另一种实现：好处，节约内存
 * 
 */

function copy(source, target) {
  let size = 3;
  let buffer = Buffer.alloc(size);
  let index = 0;
  fs.open(path.join(__dirname, source), 'r', (err, rfd) => {
    fs.open(path.join(__dirname, target), 'w', (err, wfd) => {
      function next() {
        fs.read(rfd, buffer, 0, size, index, (err, bytesRead) => {

          if (bytesRead > 0) {// 读取完毕，没有读到就停止
            fs.write(wfd, buffer, 0, bytesRead, index, (err, bytesWriten) => {
              // 当write 方法出发了回调函数的时，并不是真正的文件被成功写入，而是先把内容写入到缓存区。
              index += bytesRead;
              next();
            });
          } else {
            // 文件读取完毕后，关闭。
            fs.close(rfd, () => {
              console.log('读取成功');
            });

            // 当读取完毕后，就强制将内容从缓存区写入文件。
            fs.fsync(wfd, () => {
              // 文件写入完毕后，关闭。
              fs.close(wfd, () => {
                console.log('关闭', '拷贝成功');
              });
            });
          }
        })
      }
      next();
    })
  });
}

// copy('1.txt', '2.txt');


// read()  

/**
 * readFile():读取文件的全部内容
 * writeFile() :将内容全部写入文件
 * fs.read(fd, buffer, offset, length, position, callback):从fd指定的文件中读取数据到buffer(缓存区)
 * fs.write(fd, buffer[, offset[, length[, position]]], callback):将buffer中的内容写入到fd指定的文件中去
 * 
 */