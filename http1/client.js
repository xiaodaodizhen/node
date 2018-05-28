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
        "Content-Length": 16// 发送的内容转换为buffer的长度  ，自己写的代码客户端加上，如果是使用浏览器或命令行会自动加上；

    }
};
let req = http.request(options, (res) => {
    // 请求发送成功后会调用此函数，拿到服务端返回的结果
    res.on('data', (data) => {
        console.log(data);
    });

});
// 前后端通信靠的都是json字符串
// 向服务端发消息 ---方法一
// req.write('{"name":"zfed"}');

// 向服务端发消息（带有结束功能） ---方法二
req.end('name=zfpx&&age=9');// 表单提交式内容传送方式
// req.end('{"name":"zfed"}');// 客户端的请求发送完毕,发送的内容可以为空