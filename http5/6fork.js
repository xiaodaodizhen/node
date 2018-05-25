// 处理多并发


// 方法一
// let { fork } = require('child_process');
// let path = require('path');
// let http = require('http');
// let child = fork('6fork.js', {
//   cwd: path.join(__dirname, 'process'),

// });

// let server = http.createServer((req, res) => {
//   res.end('父进程');
// }).listen(3000);

// child.send('server', server);

// 方法二

let { fork } = require('child_process');
let path = require('path');
let net = require('net');
let child = fork('6fork.js', {
  cwd: path.join(__dirname, 'process'),
});

let server = net.createServer((socket) => {
  if (Math.random > 0.2) {
    socket.write('father');
  } else {
    child.send('socket', socket);
  }
}).listen(3000);

  