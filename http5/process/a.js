
// process.argv当前执行进程里的参数
process.argv.forEach(e => {
    // C: \Program Files\nodejs\node.exe 输出的第一个参数（内置）  当前执行的环境
    // d: \zhufeng\node\http5\process\a.js 输出的第二个参数（内置） 当前执行的文件
    process.stdout.write(e);
    // console.log(e);

});