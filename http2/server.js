// 获取范围请求
let http = require('http');
let fs = require('fs');
let path = require('path');
let { promisify } = require('util');

let stat = promisify(fs.stat);// 将fs的stat方法转换成promise对象格式

// 客户端发送一个Range:bytes=0-10

//服务端返回一个响应头 头
// Accept-Range:0-10;
//Content-Range=0-10/总大小

let server = http.createServer(async (req, res) => {
  // 转换con.txt的文件路径
  let p = path.join(__dirname, "con.txt");
  //  获取文件p的基本信息
  let statObj = await stat(p);
  let start = 0;
  let end = statObj.size - 1;// 代表的是读取流的结束为止，开始和结束是包前又包后的（例如 {0,3}这是读取4个，因为是从0 1 2 3 计算的）
  let total = end;
  let range = req.headers['range'];//获取客户端发送的Range:bytes=0-10； 服务端获取请求头都必须小写（客户端大写）
 
  if (range) {
    // 告诉他支持范围请求
    res.setHeader('Accept-Ranges', 'bytes');//返回客户端的响应头信息，区分大小写
    // 匹配range内容  Range:bytes=0-10 中的开始和结束
    let result = range.match(/bytes=(\d*)-(\d*)/);
    start = parseInt(result[1] ? result[1] : start);
    end = parseInt(result[2] ? result[2] : end);
    // 返回给客户端的响应头，获取成功并获取多少和总大小
    res.setHeader('Content-Range', `${start}-${end}/${total}`);
  }

  res.setHeader('Content-Type', 'text/plain;charset=utf8');// 返回客户端的响应头信息，区分大小写
  fs.createReadStream(p, { start, end }).pipe(res);// 读取文件p的一部分，输出到客户端
});

server.listen(9998);


//  ################可以使用命令行 curl -v --header "Range:bytes=2-7" localhost:9998 测试