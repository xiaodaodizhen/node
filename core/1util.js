let { promisefy, inherits } = require('util');
let fs = require(fs);
// 将fs.readFile进行Promise 化
let read = promisefy(fs.readFile);

// async 返回的对象是一个Promise对象， 
async function fn(params) {
    try {
        let result = await read('3.txt', 'utf8');// await 后面必须跟的是一个Promise对象
        return result;
    } catch (e) {
        console.log(e);
    }
}

fn().then(data => {
    console.log(data);
}, err => {
    console.log(err);
});


//-----------------继承
function a() {

}

function b() {

}

inherits(b, a);// 只继承a的Prototype上的公有属性和方法。

// inherits 源码最新实现方式通过此方法。
Object.setPrototypeOf(b.prototype, a.prototype);

// inherits 源码上一版本实现方式
b.prototype.__proto__ = a.prototype;