let EventEmitter = require("events");
let fs = require('fs');
let util = require('util');
class WriterStream extends EventEmitter {
  constructor(path, options) {
    super();
    this.path = path;
    this.start = options.start;
    this.encoding = options.encoding;
    this.mode = options.mode || 0o666;
    this.flags = options.flags || 'r';
    this.highWaterMark = options.highWaterMark || 16 * 1024; //可写流默认是16k
    this.autoClose = options.autoClose || true;

    //  可写流要有一个缓存区，当正在写入文件时，内容要写入到缓存区
    // 在源码中是一个链表，在这用一个[] 代替
    this.buffers = [];

    // 标识，是否正在写入
    this.writing = false;

    // 当缓存区满了，触发drain 事件
    this.needDrain = false;

    // 记录写入的位置
    this.pos = 0;
    //记录缓存区大小
    this.length = 0;

    this.open();
  }

  // 打开文件
  open() {
    fs.open(this.path, this.flags, this.mode, (err, fd) => {
      if (err) {
        this.emit('error', err);
        if (this.autoClose) {
          this.destroy();
        }
        return;
      }
      this.fd = fd;
      this.emit('open');
    });
  }

  // 销毁
  destroy() {
    if (typeof this.fd !== 'number') {
      return this.emit('close');
    }
    fs.close(this.fd, () => {
      this.emit('close');
    });
  }

  clearBuffer() {
    let buffer = this.buffers.shift();
    if (buffer) {
      this._write(buffer.chunk, buffer.encoding, () => {
        this.clearBuffer();
      });
    } else {
      if (this.needDrain) { // 判断是否需要触发 drain  --如果是true，代表缓存区 已满，不能继续读取，如果是false代表缓存区已经清空（或未满），可以继续读取
        this.writing = false;
        this.needDrain = false;
        this.emit('drain');
      }
    }
  }

  // 写文件
  write(chunk, encoding = this.encoding, callback) {
    //检查chunk是否是buffer类型，如果不是就用Buffer.from进行转换
    chunk = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk, encoding);
    // write返回的是布尔类型
    this.length += chunk.length;
    let ret = this.length < this.highWaterMark; // 比较是否达到了缓存区的上线，如果达到是因为缓存区满了，返回false  
    this.needDrain = !ret; // 是否需要触发事件 drain,如果需要则在使用本类的时候加事件监听（例如：write.js 文件中的ws.on('drain', () => {  console.log('抽出'); write();});）
    // 判断是否正在写入，如果是正在写入，就先写到缓存中
    if (this.writing) {
      this.buffers.push({
        encoding,
        chunk,
        callback
      });
    } else {
      // 专门用来将内容写入到文件
      this._write(chunk, encoding, () => this.clearBuffer());
      this.writing = true;
    }
    console.log(this.buffers);// --------------------多次执行结果显示，缓存区buffer 只是有两条数据，没有到达highWaterMark
    return ret;
  }




  // 写入文件
  _write(chunk, encoding, callback) {
    if (typeof this.fd !== 'number') {
      return this.once('open', () => {
        this._write(chunk, encoding, callback);
      });
    }
    fs.write(this.fd, chunk, 0, chunk.length, this.pos, (err, byteWritten) => {
      this.length -= byteWritten;
      this.pos += byteWritten;
      this.writing = false;
      callback();// 清空缓存区的内容
    });
  }

}
util.inherits(WriterStream, EventEmitter);
module.exports = WriterStream;
