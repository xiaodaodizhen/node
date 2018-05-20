let http = require('http');
// node可以做爬虫
let options = {
    hostname: 'localhost',
    port: 8080,
    path: '/',
    method: 'get',
    // 告诉服务端我当前要给你发送什么样的数据
    headers: {
        // "Content-Type": "application/json",// 发送的内容类型是json对象
        "Content-Type": "application/x-www-form-urlencoded",// 数据格式是表单提交式的
        "Content-Length": 16// 发送的内容转换为buffer的长度

    }
};
let req = http.request(options);

// 前后端通信靠的都是json字符串
req.end('name=zfpx&&age=9');// 表单提交式内容传送方式
// req.end('{"name":"zfed"}');// 客户端的请求发送完毕