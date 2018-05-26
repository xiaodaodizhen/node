let http = require('http');
http.createServer((req, res) => {
  res.end('wrod');
}).listen(8000);