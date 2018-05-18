// node 为了实现tcp 提供了一个名叫net的模块
// 和http用法一致
let net = require('net');
let path = require('path');
let ws = require('fs').createWriteStream(path.join(__dirname, './1.txt'));
let server = net.createServer((socket) => {
  // 监听客户输入时，将客户端输入的内容写入到文件1.txt中
  socket.pipe(ws, { end: false });//{ end: false } 可写流不关闭（不然一个客户端写完后会自动关闭写入功能）

  setTimeout(() => {
    ws.end();// 关闭可写流
    socket.unpipe(ws);// 取消管道，不能在写入
  }, 50000);
});

let port = 8080;
server.listen(port, 'localhost', () => {
  console.log(port);
});

