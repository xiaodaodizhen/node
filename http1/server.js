let http = require('http');
let server = http.createServer((req, res) => {
    // 获取客户端发送的数据类型
    let contentType = req.headers['content-type'];  // 去req的属性值时，一律小写。例如content-type 属性

    // 设置存放客户端发送过来的数据的缓存区
    let buffers = [];
    // 接受客户端发送的信息
    req.on('data', (chunk) => {
        buffers.push(chunk);
    });
    // 接收客户端发送的结束信息
    req.on('end', () => {
        let con = Buffer.concat(buffers).toString();
        if (contentType === 'application/json') { // 数据格式是json
            console.log(JSON.parse(con), 1);
        } else if (contentType === "application/x-www-form-urlencoded") { // 数据格式表单式
            let queryStr = require('querystring');
            console.log(queryStr.parse(con), 2);
        }
        // 服务端结束，并向客户端发送信息
        res.end('hello'); 
    });
}).listen(8080);