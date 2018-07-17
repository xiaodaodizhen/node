let { fork } = require('child_process');
let path = require('path');
// 直接写运行文件，第一个参数不用写node运行环境，默认就node
let child = fork('5fork.js', ['a', 'b', 'c'], {
  cwd: path.join(__dirname, 'process'),
  silent: true// （免打扰，安静的 ）['ignore','ignore','ignore','ipc'] 两者等价      如果值为true，那么5fork.js 的message监听事件的回调就不会有任何反应，如果在为true的情况下，然后5fork.js 的message回调里又向进程发送信息了，这个就失效，照常通信
});


// fork 自带 ipc 通讯功能，不用在自行配置
child.send('nihao');
child.on('message', (data) => {
  console.log(data);
});



// ##### ----------------- 源码实现fork()

let fork = (path, args, options = {}) => {
  if (options && options.silent) {
    options.stdio = ['ignore', 'ignore', 'ignore', 'ipc'];
  } else {
    options.stdio = [0, 1, 2, 'ipc'];
  }
  return spawn('node', [path, ...args], options);
}