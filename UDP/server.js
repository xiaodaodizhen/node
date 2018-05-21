let dgram = require('dgram'); // 双工流

let socket = dgram.createSocket('udp4');
// 监听一个端口，数据到来时，可以输出信息
socket.bind(8080, 'localhost', () => {
  socket.on('message', (data, rinfo) => {
    console.log(data + '等到数据到来');
    socket.send('你好', rinfo.port);
  });
});