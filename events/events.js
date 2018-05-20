function EventEimtter() {
  this._events = Object.create(null); // 创建一个空对象,这种方式创建的对象不带有__proto__属性，{}空对象会有__proto__
}
// 同一个订阅，默认最大次数.
EventEimtter.defaultMaxListeners = 10;
// 添加监听
EventEimtter.addListener = EventEimtter.prototype.on;
// 获取订阅事件名字
EventEimtter.prototype.eventName = function () {
  return Object.keys(this._events);
}
// 设置订阅次数最大值
EventEimtter.prototype.setMaxListeners = function (n) {
  return this._count = n;
}
// 返回名为 type 的事件的(订阅)监听器数组的副本。
EventEimtter.prototype.listeners = function (type) {
  return this._events[type];
}



// 获取订阅次数最大值
EventEimtter.prototype.getMaxListeners = function () {
  return this._count ? this._count : EventEimtter.defaultMaxListeners;
}

// 放到订阅最前面
EventEimtter.prototype.prependListener = function (type, cb) {
  this.on(type, cb, true);
}
// 放到最前面只走一次
EventEimtter.prototype.prependOnceListener = function (type, cb) {
  this.once(type, cb, true);
}
//订阅
EventEimtter.prototype.on = function (type, cb, flag) {
  if (!this._events) { // 如果不存在就赋默认值。因为case.js 案例中Girl 只是继承了原型链上的公有属性，没有继承私有。
    this._events = Object.create(null);
  }
  // type 如果不是newListener ，就应该让newListener的回调一次执行。
  if (type !== 'newListener') {
    this._events['newListener'].forEach(e => {
      e(type);
    });
  }
  if (this._events[type]) {
    if (flag) {
      this._events[type].unshift(cb);
    } else {
      this._events[type].push(cb);
    }
  } else {
    this._events[type] = [cb];
  }

  if (this._events[type].length === this.getMaxListeners()) {
    console.warn("超过最大值");
  }
}
// 发布
EventEimtter.prototype.emit = function (type, ...args) {
  if (this._events[type]) {
    this._events[type].forEach((listener) => {
      listener.call(this, ...args);
    }, this);
  }
}
// 订阅一次
EventEimtter.prototype.once = function (type, cb, flag) {
  function wrap(...arguments) { // 当emit时， 传递的参数，（除了emit第一个参数外的其他所有参数）
    cb(...arguments);
    this.removeListener(type, wrap);
  }
  wrap.fn = cb;// 把回调放到wrap上
  this.on(type, wrap, flag);
}
// 移除订阅
EventEimtter.prototype.removeListener = function (type, cb) {
  if (this._events[type]) {
    this._events[type] = this._events[type].filter((e) => {// false表示不要了，返回一个新数组
      return e != cb && e.fn != e; // 函数和函数不相等，并且函数的自定义属性也不相等。老师
    });
  }
}

// 移除全部订阅/监听器
EventEimtter.prototype.removeAllListeners = function () {
  this._events = Object.create(null);
}
module.exports = EventEimtter;