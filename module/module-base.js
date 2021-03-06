/**
 * 模块分为三大类： 核心模块(加载速度快，没有相对路径，直接引用)、文件模块（自定义模块，加载速度慢，相对路径，绝对路径，）、第三方模块（需要 安装）。
 * （暂时不考虑第三方模块）
<<<<<<< HEAD
 * 1)内置模块:不需要考虑路径，直接引用，天生自带；
=======
 * 1)核心模块:不需要考虑路径，直接引用，天生自带，加载速度快；
>>>>>>> ee231a82ac3d295c8bae6eeabefcd2e5f69df1be
 * 
 */

 // fs里有一个新增，判断文件是否存在

 let fs = require('fs');
 //fs.accessSync('../1.log'); // 如果文件存在不会有任何异常


// 解决路径问题
let path= require('path');
console.log(path.resolve('b','a'));//解析为绝对路径
console.log(path.join('b','a','z'));// 拼接路径，可以传递多个参数

// __dirname 当前文件的路径，此时用resolve 和join一样的效果
console.log(path.resolve(__dirname,'b'));
console.log(path.join(__dirname,'b'));
console.log(path.join(__dirname,'..','1.log','a','b'));// ".." 代表在当前目录下去上级目录
console.log(path.resolve('./1.log','/','b'));//     '/'代表跟目录，结果会/b,跟目录下的b。会忽略/ 前面的目录，因为/ 代表跟目录
console.log(path.resolve('./1.log','./','b'));// './'代表当前目录


// ## 获取基本路径
console.log(path.basename('1.log','.log'));// 经常用于获取除了后缀名的文件名字，参数'.log'，是告诉方法后缀名字，
console.log(path.extname('1.log'));//获取文件的后缀名
console.log(path.sep);// 获取路径分割符   window \ 
console.log(path.posix.sep);// 获取路径分割符  linux  /
console.log(path.delimiter);//环境变量分割符 window下是分号;
console.log(path.posix.delimiter);//环境变量分割符 linux 是冒号:


// ## vm 虚拟机模块 runinThisContext
let vm = require('vm');
let a = 2;
eval("console.log(a)"); // eval，也是global上的属性 依赖于环境（上下文）
vm.runInThisContext("console.log(a)");//沙箱， 只在本区域内，不联系上下文