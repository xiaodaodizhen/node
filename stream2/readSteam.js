let EventEmitter = require('events');
let fs = require('fs');
class ReadStream extends EventEmitter {
  constructor(path, options) {
    super();
    this.path = path;
    this.flags = options.flags || 'r';
    this.encoding = options.encoding || 'utf8';
    this.start = options.start || 0;
    this.autoClose = options.autoClose || true;
    this.highWaterMark = options.highWaterMark || 64 * 1024; // 默认是64k
    this.pos = this.start; //后续会跟着读取的进行，位置也会跟着变
    this.end = options.end;

    this.buffers = [];// 缓存区
    this.length = 0;// 缓存区的长度，往缓存区放入就回增加，就不用去单独获取this.buffers的长度，提高性能。
    this.emittedReadable = false;// 是否触发  readable 事件在去读取
    this.reading = false;// 是否正在读取，默认否


    this.open();// 打开文件

    this.on('newListener', (eventName) => {
      if (eventName == 'readable') {
        this.read();// 传参代表读取几个，不传代表把缓存区的全部读取。
      }
    });
  }
  // 读取文件   参数n 不传表示读取缓存区所有，传了表示读n个
  read(n) {
    // if (n > this.length) {
    //   //更改缓存区大小，规则，查找2的y次方，最接近n的值,如果n是5 。缓存区大小为8
    //   this.highWaterMark = 8;
    //   this.emittedReadable = true;
    //   this._read();
    // }


    let flag = true;
    let index = 0;
    let buffer;
    // 如果n>0 去缓存中去取，且缓存区中的内容满足个数
    if (n > 0 && n < this.length) {

      buffer = Buffer.alloc(n);// 这是要返回的buffer
      let buf;
      while (flag && (buf = this.buffers.shift())) {
        for (let i = 0; i < buf.length; i++) {
          buffer[index++] = buf[i];
          if (index === n) { // 拷贝够了就不需要在拷贝了
            flag = false;
            let bufferArr = buf.slice(i + 1);// 取出剩余的部分
            // 如果有剩余的部分，在放入缓存中
            if (bufferArr.length > 0) {
              this.buffers.unshift(bufferArr);
            }
            break;
          }

        }
      }
    }

    // 缓存区为空的时候，就可以触发readable 事件
    if (this.length === 0) {
      this.emittedReadable = true;
    }

    // 当缓存区小于highWaterMark，就回再去读取并放进缓存区
    if (this.length < this.highWaterMark) {
      if (!this.reading) {
        this._read();// 异步读取
        this.reading = false;
      }
    }
    return buffer;
  }


  // 封装的文件读取
  _read() {
    if (typeof this.fd !== "number") {  // open()方法是异步的，所以在读取之前先判断是否文件已经打开
      return this.once('open', () => this._read());
    }

    let buffer = Buffer.alloc(this.highWaterMark);
    fs.read(this.fd, buffer, 0, buffer.length, this.pos, (err, bytesRead) => {//bytesRead读了多少个
      if (bytesRead > 0) {
        this.buffers.push(buffer.slice(0, bytesRead))// slice 截取，实例解释： buffer 的长度是3个，但是bytesRead长度是2个，如果不截取，那么buffer里有有一个是空的，所以截取之后在仿佛buffers缓存中。
        this.pos += bytesRead;
        this.length += bytesRead;
        // 是否需要触发readable事件
        if (this.emittedReadable) {
          this.emit('readable');
          this.emittedReadable = false;
        }
      } else { // 读取完毕
        this.emit('end');
        this.destroy();
      }
    });
  }

  // 打开文件
  open() {  // 是一个异步函数
    fs.open(this.path, this.flags, 0o666, (err, fd) => { // fd 文件描述符
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
    if (typeof this.fd === 'number') {
      fs.close(this.fd, () => {
        this.emit('close');
      });
      return;
    }
    this.emit('close');
  }

}

module.exports = ReadStream;
