### 图片防盗链
- 直接打开图片没问题
- 在百度的网站上打开图片也没问题
- 在自己的服务器看就有问题，图片被一张其他的裂图代替
- fangdaolian.js


### 实现防盗链测试配置
- C:\WINDOWS\System32\drivers\etc 目录下找到hosts文件，里面内容全部清空
- 在hosts 文件下添加  如下内容
127.0.0.1       www.zfpx1.cn
127.0.0.1       www.zfpx2.cn

