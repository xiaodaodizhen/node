#! /usr/bin/env node
// 以上代码是必须的，node规定，无能为力。

let yargs = require('yargs');

// xg-server -p 3000
let argvs = yargs.options('p', {
    alias: 'port',//别名(-p 的别名是--port)    xg-server -p 3000   xg-server --port 3000
    default: 5000,// 默认值
    demand: false,// 是否必填
    type: Number,
    description: "端口号"
}).options('o', {
    alias: 'hostname',//别名
    default: 'localhost',//默认值
    demand: false,// 是否必填
    type: String,
    description: "主机"
}).options('d', {
    alias: 'dir',//别名
    default: process.cwd(),//默认值
    demand: false,// 是否必填
    type: String,
    description: "执行目录"
}).usage('usage zf-server [options]').alias('h', 'help').example('xg-server --port 3000').argv;
// 必须.argv ,否则不不知道你要执行的是命令行
// .alias('h','help') 给“help”命令增加别名

let Server = require('../src/app');
let server = new Server(argvs);
server.start();
console.log(argvs);
// 判断当前系统的类型是window 还是mac
let os = require('os').platform();
let { exec } = require('child_process'); // 在浏览器中打开相当于开启一个新的进程
let url = `http://${argvs.hostname}:${argvs.port}`;
if (argvs.open) {
    // 在命令行中，执行 xg-server --open 打开浏览器
    if (os == 'win32') { // window 情况
        exec(`start ${url}`);
    } else { // mac
        exec(`open ${url}`)
    }
}



/**
 * 可以在命令行之执行的命令：
 * xg-server -d d: （进入D盘）
 * xg-server -p 3000 
 * xg-server --open 在浏览器中打开
 * 
 */
