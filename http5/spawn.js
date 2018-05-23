// node 实现了子进程有一个自带的模块， child_process
// 创建一个进程 为我们服务，不会影响当前node的事件环；
// 多进程
// 多核cpu。如果node在开一个进城，只会占用一个cpu；

//检查一台电脑有几个cpu
// let os = require('os');
// console.log(os.cpus().length);