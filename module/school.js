console.log(2);
console.log(this);
module.exports = "zfpx";


// 总结： 
// 1.模块是 有缓存的
// 2. 模块中的this 是module.exports属性
// 3. 模块定义的变量不能互相引用
// 4.module.exports 的别名是exports


// 5.模块默认返回的是module.exports并不是exports

// 6.不能随便更改exports的指向，如果更改了不会影响module.exports的内容