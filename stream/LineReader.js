//lineReader 行读取器


let fs = require('fs');
let path = require('path');
let EventEmitter = require('events');

// 在windows下换行回车是 \r \n  0x0d(对应的数字是13)  0x0a 这是ASCII码
// 在mac 下是 \n
class LineReader extends EventEmitter {
  constructor(paths) {
    super();
    this.RETURN = 0x0d;
    this.LINE = 0x0a;
    this.buffer = [];
    this._rs = fs.createReadStream(paths);// 默认情况下会先读 highWaterMark ，如果highWaterMark没赋值，默认是64k
    this.on('newListener', (eventName) => {
      if (eventName == 'line') {
        this._rs.on('readable', () => { // 一个个的读
          let char;
          //读出来的内容都是buffer 类型
          while (char = this._rs.read(1)) {
            let current = char[0];
            switch (current) {
              // 当碰到 \r 时，表示这一行ok了
              case this.RETURN:
                this.emit('line', Buffer.from(this.buffer).toString());// emit 发射并传参
                this.buffer.length = [];
                let c = this._rs.read(1);
                // 读取\r 后，看一下是不是\n ，如果不是那么他就是一个正常的内容。
                if (c[0] !== this.LINE) {
                  this.buffer.push(c);
                }
                break;
              case this.LINE:
                this.emit('line', Buffer.from(this.buffer).toString());// emit 发射并传参
                this.buffer.length = [];
                break;
              default:
                this.buffer.push(current);
            }
          }
        });
      }
    });
  }
}

let lineReader = new LineReader(path.join(__dirname, './1.txt'));
lineReader.on('line', (data) => { // data 参数，是emit发射的时候传的参数。
  console.log(data);
});