let url = require('url');
let u = "https://cn.vuejs.org/v2/guide/index.html?a=1&b=2#hash";
// 将查询的字符串转化为对象
let urlObj = url.parse(u, true);
console.log(urlObj.query);// 查询字符串
console.log(urlObj.pathname);// 路径

// 请求头 和请求体之间有一个空行
// 请求体之间也可能有空行