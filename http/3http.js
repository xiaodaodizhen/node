let http = require('http');
// 创建server方法一
// let server = http.createServer((req, res) => {

// });




// 创建server 方法二
// http 基于tcp
let server = http.createServer();
// 监听请求的到来
server.on('connection', (socket) => {
  console.log('建立连接');
});
server.on('error', (err) => {
  console.log(err);
});
server.on('close', () => {
  console.log('服务器关闭');
});
server.on('request', (req, res) => {

});



server.listen(8080);


// 命令行中执行：curl 发送一个http请求     （获取详细内容curl -v 网址）   curl 网址