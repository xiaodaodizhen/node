let crypto = require('crypto');


/**
 * 五种算法
 * md5  sha1 sha256 sha512 ripemd160
 */


// 加密算法：加密后可以解密

/**
 * md5： 并不叫加密算法，不可逆，摘要算法（有很多网站解密，是通过碰撞检测）。
 * 1)不可逆
 * 2）不相同的结果输出的内容也不同，
 * 3）相同的内容输出的一定一样
 * 4）最终加密的结果长度一样
 */

// let md5 = crypto.createHash('md5');
// md5.update('123456');
// let result = md5.digest('hex');// 将md5转换为16进制的数据
// console.log(result);


// 加密一个大文件,可以采用多次md5.updata 来更新大文件，以达到大文件加密
let md5 = crypto.createHash('md5');
let fs = require('fs');
let path = require('path');
let rs = fs.createReadStream(path.join(__dirname, 'cons.txt'), { highWaterMark: 2 });
rs.on('data', (chunk) => {
    md5.update(chunk); // update可以调用多次使用
});

rs.on('end', () => {
    console.log(md5.digest('hex'));
});


// ############### Hmac 加盐算法加密 ---  可以根据一个所谓的密钥来加密---特点：不可逆

let crypto = require('crypto');
let m = crypto.createHmac('sha1', 'xgxgxgxg');
m.update('ok');
console.log(m.digest('hex'));



// openssl genrsa -out rsa_private.key 1024