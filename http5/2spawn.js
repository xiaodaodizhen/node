// 二： 建立三个进程，第一个是主进程，主进程创建两子进程，将第一个进程里的参数传入第二个进程里去，在第二个进程中写入到文件中去 

let { spawn } = require('child_process');
let path = require('path');

let child1 = spawn('node', ['a.js', 'b', 'c'], {
    cwd: path.join(__dirname, 'process'),
});

let child2 = spawn('node', ['b.js', 'd', 'e'], {
    cwd: path.join(__dirname, 'process'),
});
// 只有子进程的stdio的值是pipe 或者null 才可以监听，stdout   stdin  stderr  ，因为这样就会形成流。
child1.stdout.on('data', (data) => {
    console.log(data.toString());
    child2.stdout.write(data);
});