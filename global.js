// 浏览器端：全局作用域是window访问
// 后端：直接在node访问global（全局）

// node 在执行的时候，为了实现模块化，在外层增加了一个闭包。

/**
 * 
 * console 是在global上的属性
 * 
 */
// 标准输出  1  ，与process.stdout功能一样
console.log("log");
console.info("info");
// 错误输出  2 ,与process.stderr功能一样
console.error("err");
console.warn("warn");


// *****将错误输出，也输出到1.log文件中命令行为  node node1.js > 1.log 2>&1    (2代表错误输出，1代表标准输出)

// 默认属性默认是隐藏属性--配置显示隐藏为true
console.dir(Array.prototype, { showHidden: true });


//**** time 和timeEnd中的内容是一对，名字相同，相同时才能打印两端时间的间隔（一般用于算服务器的请求时间）。
console.time("label")
for (var i = 0; i < 12; i++) {

}
console.timeEnd("label")


// 断言，有错误会抛出一个断言异常(node中自带了一个模块，这个模块就叫做assert())
// console.assert((1 + 1) === 3, 'error');

/**
 *  process ：进程
 *    argv 后续执行的时候传递的参数，http-server --port 3000 （本命令未实验出来） / node 文件名 --port 3000
 *    pid  进程id，端口占用情况，任务管理器 1sof-i:8000 -9 id号
 *    chdir change directory 工作目录
 *    cwd current working directory 当前工作目录
 *    nextTick 微任务，和promise中的then比nextTick执行快
 *    stdout：标准输出 stderr：错误输出 stdin：标准输入
 *    env:环境变量（一般用于判断是开发环境还是线上环境）
 * Buffer 存储文件内容，二进制缓存
 * setImmediate 立即执行（宏任务）
 * setInteval
 * setTimeout
 * vscode 处理路径 永远都是最底下的目录
 * 
 * exit ：退出进程
 * kill:杀死进程
 * 
 */

// 2) 执行时的参数（args是个库）  在命令行中执行打印有效果
console.log(process.argv);
let args = {};
process.argv.slice(2).forEach((item, index) => {
  if (item.includes('--')) {
    args[item] = process.argv.slice(2)[index + 1];
  }
});
console.log(args);


// 3) 环境变量 （判断是开发环境还是线上环境）===windows 设置环境变量用（set NODE_ENV=development    \ set NODE_ENV=product  不能有空格，有空格不能成功实现设置）


let url;
if (process.env.NODE_ENV == 'development') {
  url = 'http://localhost:3000/api';
} else {
  url = "http://zfpx.cn";
}
console.log(process.env.NODE_ENV, url);


// 4) 目录的更改问题
console.log(1 + process.cwd());
process.chdir('..');//更改到上级目录
console.log(__dirname);// 不是gobal 属性，当前文件所在的文件夹，不会更改。
console.log(1 + process.cwd());

// 5) 输入输出
// 标准输出(两种方式) 序号1
process.stdout.write("1");
console.log("1");

// 错误输出（两种方式） 序号2
process.stderr.write("2");
console.error("2");

// 标准输入
process.stdin.on('data', (data) => {
  process.stdout.write(data);
});



//微任务 then(浏览器中) nextTick(node中)


// 宏任务 setTimeout、setInterval(浏览器中)   setImmediate(node中)

//浏览器： 先执行当前栈--》执行微任务--》 执行事件队列的内容（拿出一个）放到栈里执行--》再去执行微任务     
// 浏览器中执行结果：
//  1
//  2
//  setTimeout1
//  promise
//  setTimeout2


// 在node中的执行结果
//1
//2
//setTimeout1
//setTimeout2
//promise

console.log(1);
console.log(2);
setTimeout(function () {
  console.log('setTimeout1');
  Promise.resolve().then(function () {
    console.log('promise');
  });
});
setTimeout(function () {
  console.log('setTimeout2');
});

//--------------------------nextTIck 和then 都是在 阶段转化时才会调用，每次阶段转行都会执行‘微任务’，如果‘微任务’为空略过。
process.nextTick(function () {
  console.log("nextTick");
});

setImmediate(function () {
  console.log("immediate");
});

//--------------------------setTimeout  setImmediate 执行完毕先后取决与node 的启动执行时间，先后不定；
setTimeout(() => {
  console.log('timeout');
});
setImmediate(() => {
  console.log('immediate');
});


// i\o ：文件操作，属于宏任务
//poll的 i\o 操作完成后，会进入check阶段，所以setImmiediate会优先于timeout执行；
let fs = require('fs');
fs.readFile('1.log', function () {
  console.log('fs');
  setTimeout(function () {
    console.log('timeout');
  });
  setImmediate(function () {
    console.log('mmiediate');
  });
});

//nextTIck 会比then先执行
Promise.resolve().then(function () {
  console.log('then');
});
process.nextTick(function () {
  console.log('nextTick');
});


//--------------------------------------------实例：
setImmediate(function () {
  console.log(1);
  process.nextTick(function () {
    console.log(4);
  });
});

process.nextTick(function () {
  console.log(2);
  setImmediate(function () {
    console.log(3);
  });
});

//--------------------实例:nextTick用法---拒绝使用nextTick写递归
function Fn() {
  this.arrs;//3、
  process.nextTick(() => {//5、
    this.arrs();
  });
}
Fn.prototype.then = function () {//4、
  this.arrs = function () {
    console.log(1);
  }
}

let fn = new Fn();//1、
fn.then();//2、

// 代码走的流程：在栈中执行完毕序号1，然后栈中执行序号3，需要5放入“微任务”中，然后序号2也进入“微任务”中，此时栈执行完毕，
// 然后执行“微任务”，“微任务”中的then比nextTick 要快些，所以先执行序号4然后执行序号5

//-------nextTick 拒绝使用递归，可以放一些比setTimeout 有限执行的任务。