// 默认情况下用户应该是匿名状态
// 通过关键命令改名字  r:zhangsan
// 支持显示在线的用户列表 l:
// 广播的功能  b:xxx
// 私聊的功能  s:lisi
let net = require('net');
let clients = {};
// 改名字
function rename(key, data) {
    clients[key].nickname = data;
}
// 展示用户列表
function list(socket) {
    let str = `当前的用户列表是\n\r`;
    let arr = Object.keys(clients).map((e) => {
        return clients[e].nickname;
    }).join('\r\n');
    socket.write(str + arr + '\r\n');

}
let server = net.createServer((socket) => {
    let key = socket.remoteAddress + socket.remotePort;//唯一的随机端口号
    clients[key] = { nickname: '匿名', socket };
    server.maxConnections = 3; // 最多链接个数
    server.getConnections((err, count) => {
        socket.write(`欢迎来到聊天室，当前用户数量${count}个\r\n`);
    });
    socket.setEncoding('utf8');
    socket.on('data', (chunk) => {
        chunk = chunk.replace(/\r\n/, "");
        let chars = chunk.split(':');
        switch (chars[0]) {
            case 'r':
                rename(key, chars[1]);
                break;
            case 'b':

                break;
            case 'l':
                list(socket);
                break;
            case 's':

                break;

            default:
                socket.write('当前命令有误，请重新输入');
                break;
        }
    });
});
let port = 8080;
server.listen(port, () => {
    console.log(`server start ${port}`);
})