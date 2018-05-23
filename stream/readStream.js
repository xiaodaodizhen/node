let EventEmitter = require('events');
let fs = require('fs');
class ReadStream extends EventEmitter {
    constructor(path, options) {
        super();
        this.path = path;
        this.flags = options.flags || "r";
        this.autoClose = options.autoClose || true;
        this.highWaterMark = options.highWaterMark || 64 * 1024;
        this.start = options.start || 0;
        this.pos = options.start;// 位置会随着读取递增
        this.end = options.end;
        this.encoding = options.encoding || null;
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
            return this.once('open', () => this.read());
        }
        let len = this.end ? Math.min(this.end - this.pos + 1, this.highWaterMark) : this.highWaterMark;
        fs.read(this.fd, this.buffer, 0, len, this.pos, (err, byteRead) => {
            // byteRead 真实读到了几个
            this.pos += byteRead;//读出来两个位置就往后移两位

            let b = this.buffer.slice(0, byteRead).toString(this.encoding);
            this.emit('data', b);
            if (byteRead === this.highWaterMark && this.flowing) { // 如果相等，就意味着后面还有，或者为空，所以继续读
                return this.read();
            }

            // 这里就是没有更多的逻辑了
            if (byteRead < this.highWaterMark) { // 表示没有更多了
                this.emit('end');// 读取完毕
                this.destroy();//销毁即可
            }

        });
    }

    // 暂停之后继续读取
    resume() {
        this.flowing = true;
        this.read();
    }

    destroy() {
        //先判断有没有fd，有关闭文件，触发close事件
        if (typeof this.fd === 'number') {
            fs.close(this.fd, () => { // 如果文件打开过了，那就关闭文件，并触发close事件
                this.emit('close');
            });
            return;
        }
        this.emit('close');
    }

    open() { // open 是一个异步函数
        fs.open(this.path, this.flags, (err, fd) => {
            if (err) {
                this.emit('error', err);// 触发事件的时候会给监听的回调函数传参，可以不用
                if (this.autoClose) {// 是否自动关闭
                    this.destroy();// 触发关闭事件
                }
                return;
            }
            this.fd = fd;//保存文件描述符
            this.emit('open');//触发文件打开的方法
        });
    }
}
module.exports = ReadStream;