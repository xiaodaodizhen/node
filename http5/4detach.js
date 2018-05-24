// detach 将主进程关闭，子进程可以自己运行
// unref() （放弃引用权）子进程断绝与父进程的关系


let { spawn } = require('child_process');
let fs = require('fs');
let path = require('path');
let fd = fs.openSync('100.txt', 'w');
let child = spawn('node', ['4detach.js'], {
  cwd: path.join(__dirname, 'process'),// 当前的工作目录
  stdio: ['ignore', fd, 'ignore'],
  detached: true // 为让子进程独立于父进程之外做准备,但这个时候子进程还没有完全独立，并且主进程的退出会影响子进程的运行
});

child.unref();

//  当 stdio: ['ignore', fd, 'ignore']（当stdio设置为ignore），并且调用了child.unref()子进程才开始真正独立运行 ，主进程可独立退出，这时的子进程又叫“孤儿进程”