// npm install nrm -g  切换淘宝镜像和npm和其他源
// nrm ls 列出全部可选源，当前使用源用*标识
// nrm use cnpm 进入淘宝镜像
// nrm user npm 进入npm官方
// nrm test npm(源的名字) 测试相应源的响应速度
// nrm test  测试所有源的响应速度

// 全局安装 发布包（必须要有package.json）
// 通过命令行进行发包
// npm adduser 如果有账号相当于登录，没有就是注册,账号只能在官方登录
// npm publish  发包命令

//全局安装
// npm link 可以把当前文件夹链接到全局目录下
// 好处是边开发边测试
// 配置package.json 下的bin参数。
// "bin": {
//   "xg_one_publish": "bin/a.js"    执行xg_one_publish 命令，会执行bin文件夹下的a.js
// }
// npm install 现在等于  npm add


// npm root -g 获取全局目录