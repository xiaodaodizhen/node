let net = require('net');
// 当客户端链接服务端时，会触发回调函数，默认提示输入用户名，就可以通信了
// 自己说的话不应该通知自己，应该通知别人
let clients = {};
function broadcast(nickname, chunk) {
    Object.keys(clients).forEach(key => {
        if (key != nickname) {
            clients[key].write(`${nickname}:${chunk}\r\n`);
        }
    });
}
let server = net.createServer((socket) => {

    server.maxConnections = 3; // 最多链接个数
    // 获取链接个数
    server.getConnections((err, count) => {
        socket.write(`欢迎来到聊天室，当前用户数量${count}个，请输入用户名\r\n`);
    });
    let nickname;// 用户名，
    socket.on('end', () => {
        clients[nickname] && clients[nickname].destroy();
        delete clients[nickname]; // 删除用户
    });
    socket.setEncoding('utf8');
    socket.on('data', (chunk) => {
        chunk = chunk.replace(/\r\n/, "");
        if (nickname) {
            // 发言 broadcast(广播)
            broadcast(nickname, chunk);
        } else {
            // 第一次输入作为用户名
            nickname = chunk;
            clients[nickname] = socket;
            socket.write(`您的新用户名是${nickname}`);
        }
    });
});

server.listen(8080);