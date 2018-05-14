// 执行上下文栈（作用域）
function one() {
    let a = 1;
    two();
    function two() {
        let b = 2;
        three();
        function three() {
            console.log(b);
        }
    }
}
one();


// 队列 例如：[1,2,3,4]，依次执行



//-----------------------------------------浏览器中-------------------------
setTimeout(()=>{
    console.log(1);
},5000);

while(true){}
setTimeout(()=>{
    console.log(2);
},100);

// 调用时不会立马放进队列去，当成功时才会放到队列中；
// 栈中的代码执行完毕后，会调用队列中的代码，不停的循环；
// 当setTimeout的时间到达时，要看栈中是否已经执行完毕，如果没执行完就不会执行setTimeout---本代码中会一直执行while，即便setTimeout时间到了也不执行；