// 多语言  vue-i18n    18n(代表国际化)
// 可以支持语言的切换 

// Accept-Language: zh-CN,zh;q=0.9,en;q=0.8     (备注： q代表权重，没有q的是默认权重1)

let pack = {
  'zh-CN': {
    content: '中文'
  },
  'en': {
    content: '英文'
  }
};


let http = require('http');
let server = http.createServer();
server.on('request', (req, res) => {
  let lan = 'en';// 设置默认值
  let language = req.headers['accept-language'];
  if (language) {
    //arr =  [ zh-CN , zh;q=0.9 , en;q=0.8 ]
    let arr = language.split(',').map(e => {
      let l = e.split(';');
      return {
        name: l[0],
        q: l[1] ? Number(l[1].split('=')[1]) : 1
      }
    });

    res.setHeader("Content-Type", "text/plain;charset=utf8");
    // 给权重排序 
    arr.sort((lang1, lang2) => lang2.q - lang1.q);
    console.log(arr);
    for (let i = 0; i < arr.length; i++) {
      let name = arr[i].name;
      if (pack[name]) {
        res.setHeader('Content-Language', pack[name].content);
        res.end(pack[name].content);
      }
      break;// 这里return会怎样
    }
    res.setHeader('Content-Language', pack[lan].content);
    res.end(pack[lan].content);
  }
}).listen(8080);