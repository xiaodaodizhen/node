
//############ 子进程通信

let { spawn } = require('child_process');
let path = require('path');
let child = spawn('node', ['3ipc.js'], {
  cwd: path.join(__dirname, 'process'),
  stdio: ['pipe', 'pipe', 'pipe', 'ipc'] // 最后一个元素是ipc 代表通信
});

/**
 *stdio 参数
 * ignore : 协助子进程脱离主线程
 * pipe : 建立管道
 * null : 默认是pipe
 */




/**
 * 1.此处的child 子进程与执行文件‘3ipc.js’ 里的process 是同一个东西，都是指的是当前子进程
 * 2.send()   和 on('message) 是相对的，分别是发送消息和接收消息
 */
child.send({ name: "xg" });// 子进程响子进程的执行文件发送消息

child.on('message', (data) => { // 子进程接收消息
  console.log(data);
  child.kill();// 杀死子进程
});