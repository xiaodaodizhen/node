// 自定义客户端，（暂时不用浏览器和cmd）
let http = require('http');
let fs = require('fs');
let path = require('path');
let options = {
  hostname: 'localhost',
  port: 9998,
  path: '/',
  method: 'GET'
};

let ws = fs.createWriteStream('w.txt');

let pause = false;
let start = 0;
let downLoad = () => {
  options.headers = {
    Range: `bytes=${start}-${start + 9}`
  };

  start += 10;
  // 发请求 方式一
  // let req = http.request();  req.end()

  // 发请求 方式二       --------------http.get() 只以GET方式请求，并且会自动调用req.end()方法
  http.get(options, (res) => {
    let total = res.headers['content-range'].split('/')[1];
    let buffers = [];
    res.on('data', (chunk) => {
      buffers.push(chunk);
    });

    res.on('end', () => {
      // 将获取的数据写入文件中
      ws.write(Buffer.concat(buffers));
      setTimeout(() => {
        if (pause === false && start < total) {
          downLoad();
        }
      }, 1000);
    });
  });

}

downLoad();