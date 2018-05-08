// commonjs 规定了每一个文件都是一个模块，模块之间是相互独立的。
// 规范规定了，导出使用 module.exports,引用模块使用 require();
// 一个自定义模块文件外部会自动增加一个闭包。(function(exports,require,module,__dirname,__filename){此处是自定义的文件模块})
// 使用模块时，可以省略.js .node .json的文件后缀
let result = require('./school');
// 同步读取，并且为了节省性能还有缓存，将module.exports后面的结果进行缓存，如果有直接把缓存返回去。
console.log(result);



