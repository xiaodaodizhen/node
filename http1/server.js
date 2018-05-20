let http = require('http');
let server = http.createServer((req, res) => {
    // 获取客户端发送的数据类型
    let contentType = req.headers['content-type'];

    // 设置存放客户端发送过来的数据的缓存区
    let buffers = [];
    // 接受客户端发送的信息
    req.on('data', (chunk) => {
        // console.log(this + "5555");// this.req吗？？？？？
        buffers.push(chunk);
    });
    req.on('end', () => {
        let con = Buffer.concat(buffers).toString();

        if (contentType === 'application/json') { // 数据格式是json
            console.log(JSON.parse(con), 1);
        } else if (contentType === "application/x-www-form-urlencoded") { // 数据格式表单式
            let queryStr = require('querystring');
            console.log(queryStr.parse(con), 2);
        }
        res.end('hello');
    });
}).listen(8080);