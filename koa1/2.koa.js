let Koa = require('koa');
let app = new Koa();

app.listen(3000);

// 中间件  把中间件套一起了 --------执行顺序是按洋葱法执行，------1   3   5  6  4  2

function log() {
  return new Promise((reslove, reject) => {
    setTimeout(() => {
      console.log('ok');
      reslove();
    }, 1000);
  });
}
// 在第一个中间件中调用了next 走到了第二个中间件
// 在第二个中间件中有异步等待效果，第二个处于等待态，那就等着，但是第一个中间件会继续执行.
// 只要调用next就加await，防止下一个中间件有异步操作

app.use(async (ctx, next) => {
  console.log(1);
  await next();
  console.log(2);
});

// app.use(async (ctx, next) => {
//   console.log(1);
//   return next();  //  在koa中如果不需要 继续，可以直接return next(),这就可以不执行console.log(2)了。其他的继续执行
//   console.log(2);
// });

app.use(async (ctx, next) => {
  console.log(3);
  await log();
  await next();
  console.log(4);
});

app.use(async (ctx, next) => {
  console.log(5);
  await next();
  console.log(6);
});

//-------------------------------------------------------------------------------实现洋葱法源码

// let fn1 = (ctx, next) => {
//   console.log(1);
//   next();
//   console.log(2);
// }

// let fn2 = (ctx, next) => {
//   console.log(3);
//   next();
//   console.log(4);
// }

// let fn3 = (ctx, next) => {
//   console.log(5);
//   next();
//   console.log(6);
// }

// let fns = [fn1, fn2, fn3];
// function dispatch(index) {
//   let middle = fns[index];
//   if (fns.length === index) return function () { };
//   middle({}, () => dispatch(index + 1));
// }

// dispatch(0);