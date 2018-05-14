let fs = require('fs');
let path = require('path');
/**
 * 
 * 《同步实现---创建目录》
 * 创建文件夹
 * 创建目录:必须保证父级存在才能创建。  mkdir -p('a/b/c') 可以依次创建文件夹。   mkdir()只能创建一个。
 * 同步创建，性能低 
 *
 */

function makeP(dir) {
  let paths = dir.split('/');
  for (let i = 1; i <= paths.length; i++) {
    let newPath = paths.slice(0, i).join("/");
    try {
      fs.accessSync(newPath, fs.constants.R_OK); // 判断文件是否可读（如果可读就是文件存在），读取不到就会报错进入异常catch
    } catch (e) {
      fs.mkdirSync(newPath);
    }
  }
}
// makeP('a/b/c');


/**
 * 《异步实现-创建目录》
 * 备注：如果是异步代码，永远不能用for循环，for是同步代码。
 */

// function mkdirs(dir, cb) {
//   let paths = dir.split('/');
//   function next(index) {
//     if (index > paths.length) {
//       return cb();
//     }
//     let newPath = paths.slice(0, index).join('/');
//     fs.access(newPath, (err) => {// 判断文件是否可读，可读就说明已经存在，报错说明不存在，所以创建一个
//       if (err) {
//         fs.mkdir(newPath, (err) => {
//           next(index + 1); // 创建成功后，在创建下一个-------------？？？？？？  index++ 直接进入死循环，，++index  和index+1 缺没事
//         });
//       } else {
//         next(index + 1); // 如果本目录已经创建，直接创建下一个
//       }
//     });
//   }
//   next(1);
// }

// mkdirs('d/r/t', () => {
//   console.log("创建成功");
// });



/**
 * 《删除文件目录--同步》
 * fs.unlinkSync('a.js')  删除文件
 * fs.statSync('a.js')  文件夹状态
 */

function removeDir(dir) {
  let files = fs.readdirSync(dir); // 读取文件夹下的所有内容
  for (let i = 0; i < files.length; i++) {
    let newPath = path.join(dir, files[i]); // path.join()拼接目录
    let stat = fs.statSync(newPath); // 获取目录的所有信息
    if (stat.isDirectory()) {
      removeDir(newPath);
    } else {
      fs.unlinkSync(newPath);
    }
  }
  fs.rmdirSync(dir);// 如果文件夹是空的就将自己删除
}

// removeDir('d');



/**
 * 《删除文件目录--异步》
 * fs.stat(文件名,()=>{})  ---获取文件信息
 */

// fs.stat('d', (err, stat) => {
//   // stat对象包含文件所有属性，stat.isFile() 判断是文件还是文件夹，如果不存在则返回err
//   console.log(stat.isFile());
//   //判断当前文件是否是一个目录,返回布尔
//   if (stat.isDirectory()) {
//     //读取文件目录
//     fs.readdir('d', (err, files) => {
//       console.log(files);
//     });
//   }
// });

function rmdir(dir, callback) {
  fs.readdir(dir, (err, files) => {
    function next(index) {
      if (index === files.length) return fs.rmdir(dir, callback);
      let newPath = path.join(dir, files[index]);
      fs.stat(newPath, (err, stat) => {
        if (stat.isDirectory()) {
          // 应该读的是b里面的第一个，而不是平级的另一个目录，等本目录读取完毕后，才进行平级目录的执行。
          rmdir(newPath, () => next(index + 1));
        } else {
          // 删除文件后继续遍历
          fs.unlink(newPath, next(index + 1));
        }
      });
    }
    next(0);
  });
}

// rmdir('b', () => {
//   console.log("执行完毕");
// });



// promise 的方式删除
// function removePromise(dir) {
//   return new Promise((resolve, reject) => {
//     fs.stat(dir, (err, stat) => {
//       if (stat.isDirectory()) {
//         fs.readdir(dir, (err, files) => {
//           files = files.map(file => removePromise(path.join(dir, file)));
//           Promise.all(files).then((data) => {
//             fs.rmdir(dir, resolve());
//           }, err => {
//           });
//         });
//       } else {
//         fs.unlink(dir, resolve());
//       }
//     });
//   });
// }
// removePromise("d").then((data) => {
//   console.log("删除成功");
// }, (err) => {

// });




/**
 * 
 * 横向删除,实质是同步广度遍历。
 * 
 * 
 */
function priWide(dir) {
  let arrs = [dir];
  let index = 0;
  let current;
  while (current = arrs[index++]) {
    let stat = fs.statSync(current);
    if (stat.isDirectory()) {
      let files = fs.readdirSync(current);
      arrs = [...arrs, ...files.map(file => path.join(current, file))];
    }
  }
  for (let i = arrs.length; i >= 0; i++) {
    let stat = fs.statSync(arrs[i]);
    if (stat.isDirectory()) {
      fs.rmdirSync(arrs[i]);
    } else {
      fs.unlinkSync(arrs[i]);
    }

  }
}


/**
 * fs.watchFile(当前的状态,上一次的状态)  
 * 监控文件有没有改动
 * 
 */
// fs.watchFile('4.txt', (current, prev) => {
//   if (Date.parse(current.ctime == 0)) {
//     console.log('不存在');
//   } else if (Date.parse(prev.ctime === 0)) {
//     console.log('创建');
//   } else {
//     console.log('修改');
//   }
// });

/**
 * fs.rename('a','b') a文件重命名为b
 * 
 * fs.truncate('1.txt',4) 截断 
 * 
 */



/***
 * 深度删除
 * 
 */

function wide(dir, callback) {
  let arr = [dir];
  let index = 0;

  function rmdir() {
    function next() {
      if (!index) {
        return callback();
      }
      let current = arr[--index];
      fs.stat(current, (err, stat) => {
        if (stat.isDirectory()) {
          fs.rmdir(current, next);
        } else {
          fs.unlink(current, next);
        }
      });
    }
    next();
  }

  // 将所有级别的目录都拼接到一个一维数组中
  function next() {
    if (index === arr.length) {
      return rmdir();
    }
    let current = arr[index++];
    fs.stat(current, (err, stat) => {
      if (stat.isDirectory()) {
        fs.readdir(current, (err, files) => {
          arr = [...arr, ...files.map((file) => {
            return path.join(current, file);
          })];
          next();
        });
      } else {
        next();
      }
    });
  }
  next();
}
wide('zz', () => {
  console.log("删除成功");
})

