let http = require('http');
let server = http.createServer((req, res) => {
    // write 方法不能在end之后调用
    // res.write()
    //res.end()
    // 响应可以设置响应头

    // 默认情况下返回给客户端内容 （状态码）200
    // 方法一
    // res.statusCode = 200;
    // res.setHeader('Content-Type', 'text/plain');
    // res.setHeader('name', 'zfpex');

    // 方法二
    res.writeHead(200, { 'Content-Type': 'text/plain' });

    // 取响应头，方法一不会真正的把响应头写给客户端，方法二可以，,通过res.headersSent来进行查看，返回布尔, 备注：方法一返回false，方法二返回true；；res.setHeader与res.writeHead不能同时使用。
    console.log(res.headersSent);

    // console.log(res.getHeader('name'));
    // res.removeHeader('name')---删除响应头内容
    //  res.sendDate = false;  是否发日期
    // 调用write 之前才能调用setHeader方法
    //Content-length:2;
    res.end('ok');// 会把内容放到页面上

});

server.listen(3000);