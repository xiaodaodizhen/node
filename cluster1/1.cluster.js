// 集群 很多个子进程

let cluster = require('cluster');

// 进程不是越多越好，而是根据cpu的核数。创建相对应的进程。

// if (cluster.isMaster) {
//   // 在主分支中可以创建子进程
//   cluster.fork();
//   cluster.fork();
//   console.log('父');
// } else {
//   console.log('子');
//   process.disconnect();// 断开连接,当前服务还继续,不再支持新的服务
//   //process.exit();// 退出子进程,服务直接挂掉
// }

// 下面代码不管是主分支还是子进程都会执行
// console.log(1);

// cluster.on('fork', (worker) => { // worker 是创建的当前那个进程
//   console.log(worker.id);
// });

// // 监听进程退出
// cluster.on('exit', () => {
//   console.log('exit');
// });


// 进程断开连接，但是不会退出
// cluster.on('disconnect',()=>{
//   console.log('断开连接');
// });





//----------------------------------------------------------------------------------------------------------------------------------------

// 可以通过ipc的方式进行进程间的通讯，默认不支持pipe方式，可以通过cluster.setupMaster({stdio:'pipe'})进行配置

// let cpus = require('os').cpus().length;
// let http = require('http');
// if (cluster.isMaster) {
//   // cluster.setupMaster({ stdio: 'pipe' });   配置上此项就可以支持pipe通讯

//   // 在主分支中创建子进程
//   for (let i = 0; i < cpus; i++) {
//     cluster.fork();
//   }
// } else {
//   http.createServer((req, res) => {
//     res.end('ok' + process.pid);
//   }).listen(3000)
// }
// cluster.on('fork', (worker) => {
//   console.log(worker.process.pid);
// });


//-----------------------------------------------------------------------------------------------------------------------------------------

let cpus = require('os').cpus().length;
let path = require('path');
// setupMaster 所有的设置只对后来的cluster.fork()的子进程有效，对之前的工作进程无影响，
cluster.setupMaster({
  exec: path.join(__dirname, "subprocee.js")
});

// 在主分支中创建子进程
for (let i = 0; i < cpus; i++) {
  cluster.fork();
}

