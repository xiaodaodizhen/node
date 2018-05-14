let EventEmitter = require('events');
let fs = require('fs');
class ReadStream extends EventEmitter {
    constructor(path, options) {
        super();
        this.path = path;
        this.flags = options.flags || "r";
        this.autoClose = options.autoClose || true;
        this.highWaterMark = options.highWaterMark || 64 * 1204;
        this.start = options.start || 0;
        this.end = options.end;
        this.open();//打开文件fd
        // 要建立一个buffer 这个buffer是一次要读多少
        this.buffer = Buffer.alloc(this.highWaterMark);
        this.flowing = null;//null 代表暂停模式
        // 看是否监听了data事件，如果监听了就要变成流动模式，本方法是同步的，
        this.on('newListener', (eventName, callback) => {
            if (eventName == "data") {
                //监听了data事件，就需要改变为流动模式
                this.flowing = true;
                //读内容
                this.read();
            }
        });
    }

    read() {
        if (typeof this.fd !== "number") {
            // 当文件真正打开的时候，会触发open事件，触发事件后在执行
            this.once('open', () => read());
        }
        fs.read(this.fd,this.buffer,0, );
    }

    destroy() {
        //先判断有没有fd，有关闭文件，触发close事件
        if (typeof this.fd === 'number') {
            fs.close(this.fd, () => {
                this.emit('close');
            });
            return;
        }
        this.emit('close');
    }

    open() { // open 是一个异步函数
        fs.open(this.path, this.flags, (err, fd) => {
            if (err) {
                this.emit('error');
                if (this.autoClose) {// 是否自动关闭
                    this.destroy();
                }
                return;
            }
            this.fd = fd;//保存文件描述符
            this.emit('open');//文件打开了
        });
    }
}
// module.exports = ReadStream;