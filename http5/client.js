let http = require('http');

for (var i = 1; i < 10; i++) {
  http.get({
    hostname: 'localhost',
    port: 3000,
    method: 'GET',
    path: '/'
  }, (res) => {
    res.on("data", (data) => {
      console.log(data.toString());
    })
  });
}