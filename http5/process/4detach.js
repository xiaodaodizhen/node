// 会自动将这个描述符fd包装成可写流、、

// 此时 process.stdout 就是文件描述符fd
setInterval(() => {
  process.stdout.write('hello');
}, 1000);