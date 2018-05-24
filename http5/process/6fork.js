// 方法一
// let http = require('http');
// process.on('message', (mgs, server) => {
//   http.createServer((req, res) => {
//     res.end('子进程');
//   }).listen(server);
// });

// 方法二

let http = require('http');
process.on('message', (mgs, socket) => {
  if (mgs == "socket") {
    socket.write('child');
  }
});
     