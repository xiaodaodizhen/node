let dgram = require('dgram'); // 双工流

let socket = dgram.createSocket('udp4');
socket.send('大声道', 8080, () => {
  console.log('keyi l ');
});
socket.on('message', (data) => {
  console.log(data.toString());
});