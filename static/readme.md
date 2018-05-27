# 模拟静态服务器(手写一个包)

## 所需模块 mime chalk debug supervisor(需要全局安装)  ejs(模板引擎)  yargs

- public 文件夹： 静态文件所在的位置

- supervisor 使用方法  进到需要执行的目录下，supervisor app.js


- 在static 文件夹下 npm link 会把本包放到全局中执行（任何一个目录下都可以执行命令），在这之前，要在package.json 文件中配置 
 "bin": {
    "xg-server": "bin/www.js"
  }


#####  将此包发送到npm 官网上
- nrm ls （源要在npm上，不能在其他镜像上）



