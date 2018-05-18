// node 为了实现tcp 提供了一个名叫net的模块
// 和http用法一致
let net = require('net');

// 创建一个tcp服务 里面放一个回调函数（也叫监听函数），当链接到来时才会执行
// socket 套接字，是一个duplex（双工流），可以支持读写操作。
let server = net.createServer((socket) => {

  // tcp链接方式 ： telnet  \  putty

  // 最大链接数
  server.maxConnections = 2;
  // 希望每次请求到来时都有一个提示，当前链接了多少个，一共链接了多少个
  server.getConnections((err, count) => {
    // socket 每次链接时都会产生一个新的socket
    socket.write(`当前最大容纳${server.maxConnections}，当前共${count}`);
  });
  // 设置从客户端获取数据的编码
  socket.setEncoding('utf8');
  // 在客户端中输入数据
  socket.on('data', (data) => {
    console.log(data);
    // socket.end(); 触发客户端的关闭
    // close事件表示服务端不在接收新的请求了，当前的还能继续使用，当客户端全部关闭后会执行close事件
    // server.close();

    // 如果所有客户端都关闭了，服务端就关闭，不会触发close事件,如果有客户端进来请求仍然可以
    // server.unref();
  });

  // 监听客户端关闭
  socket.on('end', () => {
    console.log('客户端关闭');
  });
});


// backlog服务端最大能处理多少个请求 默认是511,此参数可以不传
let port = 8080;
server.listen(port, 'localhost', () => {
  console.log(port);
});

// 只有嗲用colse方法才能触发，
server.on('close', () => {
  console.log('服务端关闭');
});

// 当服务端发生错误时(端口被占用的情况，解决方法一，自动在原有端口的基础上加1更改下端口)
server.on('error', (err) => {
  if (err.code == 'EADDRINUSE') {
    server.listen(++port);
  }
});