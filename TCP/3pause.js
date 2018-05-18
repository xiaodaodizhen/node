let net = require('net');
// 需求1：等待客户端输入，过两秒钟在打印
let server = net.createServer((socket) => {
  socket.pause();// 暂停触发data事件
  // 当客户端多长时间不访问，也可以触发一个函数，一般情况下当时间到达后，可以关闭客户端
  socket.setTimeout(5000);

  socket.on('data', (data) => {
    console.log(data);
  });
  // 监听timeout事件，恢复
  socket.on('timeout', () => {
    socket.resume();
    socket.end();
  });
});

let port = 8080;
server.listen(port, 'localhost', () => {
  console.log(port);
});
