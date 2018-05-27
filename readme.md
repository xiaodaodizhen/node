## 线程  
- js线程  ui线程   这两个线程是互斥的，目的是为了保证不产生冲突。
- ui线程会把更改放到队列中， 当js线程空闲下来后，ui线程在继续渲染。

## webworker 多线程*
- webworker(有一些计算功能) 和js 主线程是不平级的，主线程可以控制webworker,webworker不能操作dom， 不能获取document，window。
- js 只能是单线程的，不能两个线程同时操作一个dom

## 多线程
- 有的时候可能浪费资源，切换时间片，
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
- 异步：未完




## 调试node代码 
  ### 方法一：
  - node.js 版本 6.3+
  - Chroms  版本5.5+

  - Step 1: node --inspect 文件名  （启动node代码）；
        -  node --inspect-brk 文件名  （启动node代码，并从第一行开始调试）；

    备注：Debugger listening on ws://127.0.0.1:9229/4dc825ec-a204-46f8-8edc-4afadc8da61a
        For help see https://nodejs.org/en/docs/inspector 有这样的输出；

  - Step 2: 在Chroms 浏览器中打开 chorm://inspect/#devices，显示调试界面；

  - Step 3: 直接点击界面中的 “inspect” 进入调试；


  ### 方法二：
  - 使用vscode 自带的调试功能，配置launch.json ，可以直接进行调试，（步骤不详细陈述）；


  ## events 文件夹下，是node的events源码实现和案例。

  ## module 文件夹下，是node的module 源码实现和案例。


  ## npm install http-server -g  可以在某个文件夹下起服务，执行http-server

  ## 宏任务   微任务 ----执行时机是不一样的，共同点-都是异步
  - 常见的宏任务，
    - 浏览器中：setTimeout setInterval  setTmmediate(只兼容ie)
    - vue 中 ： MessageChannel
  - 常见的微任务 ：
    - promise的then   
    - MutationOBserver(有兼容问题)的nextTick