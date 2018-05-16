/**
 * 流：node里的很多内容都应用到了流；
 * 特点：有序，有方向；
 * 
 *  分为：可读流  可写流
 *   对文件操作作用的也是fs模块
 */
let ReadStream = require('./readStream');
let fs = require('fs');
let path = require('path');
// 返回的是一个可读流的一个对象
// let rs = fs.createReadStream(path.join(__dirname, '1.txt'), 
let rs =  new ReadStream(path.join(__dirname, '1.txt'), {}
    // {
    //     flags: 'r',// 文件的操作是读取操作
    //     encoding: 'utf8',//默认是null，null代表的是buffer
    //     autoClose: true,//读取完毕后自动关闭
    //     start: 0,//从哪里开始读取
    //     end: 8,// 从哪里结束（包含8）
    //     highWaterMark: 3,//每次最多读取多少 3b，默认是64k
    // }
);
// rs.setEncoding("utf8");//与上面配置的enconding 属性一样的功能
// 默认情况下，不会将文件中得内容输出，内部会先创建一个buffer先读取3b，他的默认状态是“非流动”/“暂停模式”
//流动模式会疯狂的出发data事件，直到内容读取完毕。
rs.on('open', () => {
    console.log('文件打开了');
});
rs.on('data', (data) => { //使用data事件后，会由“暂停模式”转换为“流动模式”
    console.log(data);
    rs.pause();//暂停方法，表示暂停读取，暂停data事件触发
});

setInterval(()=>{
    rs.resume(); //恢复data事件的触发。继续读取，变为流动模式。
},3000);
rs.on('end', () => {
    console.log('结束');
});
rs.on('close', () => {
    console.log('关闭了');
});
rs.on('error', (err) => {
    console.log(err);
});