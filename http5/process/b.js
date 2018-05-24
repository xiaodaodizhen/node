let fs = require('fs');
let ws = fs.createWriteStream('./11.txt');;
process.stdout.on('data', (data) => {
    ws.write(data);
});