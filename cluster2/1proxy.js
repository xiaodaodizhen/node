// 正向代理   反向代理

let httpProxy = require('http-proxy');
let http = require('http');
//创建服务器代理
let proxy = httpProxy.createProxyServer();
// ---------------------------------------------------------------------------------正向代理
// http.createServer((req, res) => {
//   // 发送代理请求
//   proxy.web(req, res, {
//     target: 'http://localhost:8000'
//   });
// }).listen(3000);


//----------------------------------------------------------------------------------- 反向代理

let hosts = {
  'www.zfpx1': 'localhost:8000',
  'www.zfpx2': 'localhost:4000'
};
http.createServer((req, res) => {
  let host = req.headers['host'];
  proxy.web(req, res, {
    target: hosts[host]
  });
});