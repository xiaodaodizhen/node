## 线程  
- js线程  ui线程   这两个线程是互斥的，目的是为了保证不产生冲突。
- ui线程会把更改放到队列中， 当js线程空闲下来后，ui线程在继续渲染。

## webworker 多线程*
- webworker 和js 主线程是不平级的，主线程可以控制webworker,webworker不能操作dom， 不能获取document，window。

## 浏览器中的event loop (事件环)- 堆、栈、队列

## 栈（stack）和队列(queue)
- 栈（存放方法和普通变量）：先进后出 ----例如:函数调用--结合栈.png 图

## 堆（heap）
- 存放对象


## node的特点
- 异步 非阻塞i/o （libuv）

## 同步（阻塞）和异步（非阻塞）
- 阻塞和非阻塞指的是调用者的状态；
- 同步和异步指的是被调用者是如何通知的；
- 同步：线性执行；
- 异步：