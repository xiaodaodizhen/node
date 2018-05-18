let net = require('net');
let path = require('path');
let rs = require('fs').createReadStream(__dirname + '/2.txt');
// 希望客户端访问服务端时，服务可以将一个文件发送给客户端
let server = net.createServer((socket) => {
  rs.on('data', (data) => {
    let flag = socket.write(data);
    console.log(flag);
    console.log('缓存区的大小' + socket.bufferSize);
  });
  socket.on('drain', () => {
    console.log('抽干');
  });
});      

let port = 8080;
server.listen(port, 'localhost', () => {
  console.log(port);
});

// let fs = require('fs');
// fs.writeFileSync(__dirname + '/2.txt', Buffer.alloc(1024 * 1024 * 10));