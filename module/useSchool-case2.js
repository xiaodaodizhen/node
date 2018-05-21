let path = require('path');
let fs = require('fs');
let vm = require('vm');
function Module(filename) {//构造函数
    this.filename = filename;
    this.exports = {};// 每个模块都会有这样一个属性
    this.loaded = false;// 这个模块默认没加载完
}
// 文件后缀名（还可以在本数组中追加方法）
Module._extentions = ['.js', '.json', '.node'];
Module._cache = {};//缓存，{key（绝对路径）: con（文件内容）}

// 通过文件名，解析为绝对路径。
Module._resolvePathname = function (filename) {
    let p = path.resolve(__dirname, filename);
<<<<<<< HEAD
    if (!path.extname(p)) { // extname 获取文件扩展名，如果没有就添加扩展名
=======
    if (!path.extname(p)) { // 检查是否带有后缀名，没有就加上
>>>>>>> ee231a82ac3d295c8bae6eeabefcd2e5f69df1be
        for (let i = 0; i < Module._extentions.length; i++) {
            const e = Module._extentions[i];
            let newPath = p + e;
            try { // 如果访问的文件不存在，就会发生异常；
                fs.accessSync(newPath);// 如果文件存在就不会有任何异常，否则将抛出异常错误。
                return newPath;
            } catch (e) {
                throw new Error(e);
            }
        }
    }

    return p;
}
// 自定义模块时，环境自动在模块代码外部添加的闭包，---在调试代码的时候可见。
Module.wrapper = [
    "(function(exports,require,module,__dirname,__filename){", "\n})"
];
// 将自定义模块代码，添加到环境自动添加的闭包内，
Module.wrap = function (script) {
    return Module.wrapper[0] + script + Module.wrapper[1];
}

// 在Module._extentions数组中增加名字为js的function；
Module._extentions["js"] = function (module) {
    let script = fs.readFileSync(module.filename, 'utf8');
    let fnStr = Module.wrap(script);
    vm.runInThisContext(fnStr).call(module.exports, module.exports, req, module);//call第一个参数可以为null，undifined,{}????  -----第三个参数req可以为null，会默认有有一个方法，即便传了其他方法也不会改变默认的？？？？？？
}

Module._extentions["json"] = function (module) {
<<<<<<< HEAD
    let script = fs.readFileSync(module.filename);
=======
    let script = fs.readFileSync(module.filename, "utf8");
>>>>>>> ee231a82ac3d295c8bae6eeabefcd2e5f69df1be
    module.exports = JSON.parse(script);
}

// 模块加载方法
Module.prototype.load = function (filename) {
    let ext = path.extname(filename).slice(1);// .js .json
    Module._extentions[ext](this);//this 代表当前模块
}

/**
 * 
 * filename :文件名，可能没有后缀名。
 */
function req(filename) {
    // 需要一个绝对路径，缓存是根据绝对路径实现的
    filename = Module._resolvePathname(filename);
    let cacheModul = Module._cache[filename];//获取缓存对象的内容
    // 检查文件路径在缓存中是否存在，如果存在直接返回；
    if (cacheModul) {
        return cacheModul.exports;
    }
    //没缓存，就创建模块,加载模块；
    let module = new Module(filename);
    module.load(filename);
    Module._cache[filename] = module;
    return module.exports;

}

let result = req('./school');
console.log(result);