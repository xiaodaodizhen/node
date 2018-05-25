let { execFile } = require('child_process');

// spawn execFile 都是异步的

execFile('node', ['-v'], {
  maxBuffer: 100
}, (err, stdout, stderr) => {
  // 他的结果会被缓存，等待结束后一起输出 200
  console.log(stdout);
});

execFile('ls', ['-l'], { // 第一个参数可以放命令，也可以放执行文件
}, (err, stdout, stderr) => {
  // 他的结果会被缓存，等待结束后一起输出 200
  console.log(stdout);
});


let { exec } = require('child_process');
// execFile 支持[]参数。exec不支持，可以把参数写到第一个参数中
exec('ls -l', {
}, (err, stdout, stderr) => {
  // 他的结果会被缓存，等待结束后一起输出 200
  console.log(stdout);
});

exec('start http://localhost:3000');