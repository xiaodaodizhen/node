// context 代理 request 和response 属性
// 设置getter和setter

let proto = {

}
function delateGetter(property, name) {
    // __defineGetter__ 使用方法，这两个函数要求第一个是getter或setter的名称，以string给出，第二个参数是作为getter或setter的函数。 
    proto.__defineGetter__(name, function () { // 这不能使用=> ，报错？？？？？？？？？？？？？？？
        // this指的是proto,也是指的是application.js 中的ctx ------由这句代码而来let ctx = Object.create(this.context);
        return this[property][name];
    })
}

function delateSetter(property, name) {
    proto.__defineSetter__(name, function (val) {
        this[property][name] = val;
    });
}

// ctx.query === ctx.request.query
// ctx===proto;
// 让 proto 代理request 上的query 属性
delateGetter('request', 'query');
delateGetter('request', 'method');
delateGetter('response','body');
delateSetter('response','body');
module.exports = proto;