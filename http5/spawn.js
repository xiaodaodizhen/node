// node 实现了子进程有一个自带的模块， child_process
// 创建一个进程 为我们服务，不会影响当前node的事件环；
// 多进程
// 多核cpu。如果node在开一个进城，只会占用一个cpu；

//检查一台电脑有几个cpu
// let os = require('os');
// console.log(os.cpus().length);

// 如何创建一个子进程，复杂在与进程之间的通信
// node 不合适，cpu密集

// spawn 生成   fork 叉子  exex执行 execFile执行文件，后面三个都是基于spawn 封装的。

let { spawn } = require('child_process');
let path = require('path');

// 创建一个子进程
let child = spawn('node', ['a.js', 'b', 'c'], { //node参数是当前执行的环境，a.js 是当前执行的文件 'b' 'c'是文件'a.js'的参数
    // cwd 是process.cwd()  获取进程里的工作目录
    cwd: path.join(__dirname, 'process'),
    stdio: [process.stdin, process.stdout]
    // stdio: [0, 1]
    // stdio:'inherit' // 继承父进程的参数


    // -----------以下传参方式未实现
    // stdio:'pipe'
    // stdio:['pipe','pipe','pipe']
    // 如果不写stdio属性，默认是管道雷类型
    // stdio :null ，等于 stdio:'pipe'
});

/**
 * 主进程里有三个东西
 * process.stdin    0
 * process.stdout   1
 * process.stderr   2
 * 
 * 
 */


child.on('error', (err) => {
    console.log(err);
});

child.on('exit', () => {
    console.log('退出');
});

child.on('close', () => {
    console.log('关闭了');
});




