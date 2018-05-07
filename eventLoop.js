console.log(1);
console.log(2);
setTimeout(() => {
    // 将本函数放到栈中执行
    console.log(3);
    // 将定时回调函数放到队列中执行
    setTimeout(() => {
        // 将本函数放到栈中执行
        console.log(6);
    });  // 定时器时间不传，默认是 4
}, 0);

setTimeout(() => {
    console.log(4);
    setTimeout(() => {
        console.log(7);
    });
}, 0);

console.log(5);

// 当触发回调函数时，会将回调函数放到队列中




setTimeout(() => {
    console.log(9);
}, 4);
for (let i = 0; i < 10000; i++) {
    console.log(i);
}

// 结果是先执行完for循环，然后执行定时器的---理由：for循环在栈中，setTimeout在队列中，执行顺序是栈中的代码执行完毕后才执行队列中的代码