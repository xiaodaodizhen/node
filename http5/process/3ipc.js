process.on('message', (data) => {
  console.log(data);

  process.send(data.name + "一家四口，就你最丑");
});