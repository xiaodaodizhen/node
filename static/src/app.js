let config = require('./config');
let http = require('http');
let path = require('path');
let fs = require('fs');
let mime = require('mime');
let chalk = require('chalk'); // 粉笔
let util = require('util');
let url = require('url');
let ejs = require('ejs');
let zlib = require('zlib');
let stat = util.promisify(fs.stat);
let readdir = util.promisify(fs.readdir);
// debug 后面放置的是参数（参数是环境变量），可以根据参数决定是否打印
// 设置环境变量window--- set DEBUG=static:app    mac ----  export DEBUG=static:app
let debug = require('debug')('static:app');
// debug('app');
let tmpl = fs.readFileSync(path.join(__dirname, '../public/tmpl.ejs'), 'utf8');
class Server {
  constructor() {
    this.config = config;
    this.tmpl = tmpl;
  }
  handleRequest() {
    return async (req, res) => {
      let { pathname } = url.parse(req.url, true);
      let p = path.join(this.config.dir, "." + pathname);
      try {
        let statObj = await stat(p); // 判断文件是否存在，返回的是文件信息
        if (statObj.isDirectory()) {
          // 如果是目录展示目录内容
          // 利用模板引擎ejs

          let dirs = await readdir(p);// 读取目录的文件路径
          dirs = dirs.map(dir => ({
            path: path.join(pathname, dir),
            name: dir
          }));

          let content = ejs.render(this.tmpl, { dirs });
          res.setHeader('Content-type', 'text/html;charset=utf8');
          res.end(content);
        } else {
          // 如果是文件就直接将内容发送到页面
          this.sendFile(req, res, p, statObj);
        }
      } catch (e) {
        this.sendError(req, res, e);
      }
    }
  }

  // 缓存
  cache(req, res, statObj) {
    let ifNnoeMatchSince = req.headers['if-modified-since'];// 对比时间缓存
    let ifNoneMatch = req.headers['if-none-match'];// 对比摘要缓存,一般是内容的一个md5    ctime-size
    // 服务器上的文件的最新修改时间
    let since = statObj.ctime.toUTCString();
    // 服务器上的最新的文件描述
    let etag = new Date(since).getTime() + '-' + statObj.size;
    // 对比缓存
    res.setHeader('Etag', etag);
    res.setHeader('Last-Modified', since);
    // 强制缓存
    res.setHeader('Cache-Control', 'max-age=10');

    // 没有缓存
    if (ifNoneMatch != etag) {
      return false;
    }

    if (ifNnoeMatchSince != since) {
      return false;
    }
    // 有缓存
    res.statusCode = 304;
    res.end();
    return true;
  }

  //压缩
  compress(req, res, p, statObj) {
    let lib = req.headers['accept-encoding'];
    if (lib.match(/\bgzip\b/)) {
      // res.setHeader('Content-Encoding', 'gzip');
      return zlib.createGzip();
    } else if (lib.match(/\bdeflate\b/)) {
      // res.setHeader('Content-Encoding', 'deflate');
      return zlib.createDeflate();
    } else {
      return false;
    }
    return false;
  }

  // 请求范围
  range(req, res, p, statObj) {
    let range = req.headers['range'];
    let start = 0;
    let end = statObj.size;
    if (range) {
      let [, s, e] = range.match(/bytes=(\d*)-(\d*)/);
      start = s ? parseInt(s) : start;
      end = e ? parseInt(e) : end;
    }
    return fs.createReadStream(p, { start, end: end - 1 })
  }

  // 向页面发送内容
  sendFile(req, res, p, statObj) {
    // 缓存功能---对比（时间对比，md5+size）  强制
    if (this.cache(req, res, statObj)) return;
    res.setHeader('Content-Type', mime.getType(p) + ';charset=utf8');

    // 请求范围
    let stream = this.range(req, res, p, statObj);

    // 压缩
    let lib = this.compress(req, res, p, statObj);
    if (lib) {
      stream.pipe(lib).pipe(res);
    }




    stream.pipe(res);
  }


  // 错误方法
  sendError(req, res, e) {
    debug(util.inspect(e).toString());
    res.statusCode = 404;
    res.end();
  }

  // 启动服务方法
  start() {
    let { port, hostname } = this.config;
    let server = http.createServer(this.handleRequest());
    let url = `http://${hostname}:${chalk.green(port)}`;
    // debug(url);
    server.listen(port, hostname);
  }
}
let server = new Server();
server.start();

