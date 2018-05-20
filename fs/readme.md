## 在npm 官网上传自己的包步骤。
- 先把源切换到官网
- 在自己定义的包文件中，必须有package.json 文件，例如：
  - {
    "name": "xg_one_publish",
    "version": "1.0.0",
    "description": "A packaged test for xg",
    "main": "foo.js",
    "scripts": {
      "text": ""
     },
    "bin": {
      "xg_one_publish": "bin/a.js"
     },
    "license": "ISC"
   }
  - 备注：package.json 文件中不允许有注释，否则报错。
  - main 属性，是文件入口。
  - bin  属性，设置 命令，和此命令对应的执行文件。有bin属性才能进行全局安装此包，然后bin下的xg_one_publish命令就被注册到全局中，可以命令行直接执行了
  - 在命令执行所对应的文件头部（例如：a.js）必须添加  #! /usr/bin/env node，否则不能正确执行，此规定是node规定。
- npm addUser   (如果在官网已经有账号，此命令就是登录；如果还未有账号，此命令就是注册。)
- npm publish   (在npm 官网上发布自己的包)
- npm unpublish (卸载自己发布的包)
- npm link      (把当前文件夹链接到全局目录下，好处是边开发边测试)

## npm root -g 获取node全局安装包的存放目录

## npm install == npm add