// on: 监听的目的就是为了构造这样一个对象{'买彩票':[buyCar,buyHouse]}， 一对多的关系
// emit : 发布的时候，会让数组依次执行；

let EventEimtter = require('./events');
let util = require('util');
function Girl() {

}
util.inherits(Girl, EventEimtter);  // Girl 的prototype 会指向EventEimtter

let girl = new Girl();
let buyCar = function (data) {
  console.log(data);
}
let buyHouse = function (data) {
  console.log(data);
}
girl.setMaxListeners(2);
girl.on('newListener', function (eventName) {
  console.log(eventName);
});
girl.on('中奖', buyCar);// {'中奖':[buyCar]}
girl.on('中奖', buyHouse);// {'中奖':[buyCar,buyHouse]}
girl.on('中奖', buyCar);
girl.once('中奖', buyCar);
girl.prependListener('中奖', function () {
  console.log('这是最前面');
});
console.log(girl.eventName());
girl.removeListener('中奖', buyCar);
girl.emit("中奖", '33'); // emit 的参数，除了第一个，其他的都是传递给 监听事件回调函数的参数