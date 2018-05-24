process.on('message', (data) => {
  // process.send(data + "收到了，再次发送");
  console.log(data);
});