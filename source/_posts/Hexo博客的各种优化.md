---
title: Hexo博客的各种优化
tags:
  - Hexo教程
keywords: Hexo教程
comments: true
categories: Hexo教程
cover: 'https://img0.baidu.com/it/u=3739552084,952829373&fm=26&fmt=auto&gp=0.jpg'
abbrlink: a72a6e9b
date: 2021-08-05 09:58:09
description:
top_img:
---




## 页脚跳动的心

编辑博客根目录 /themes/Butterfly/layout/includes/footer.pug 文件

找到如下代码
```javascript
#footer-wrap
  if theme.footer.owner.enable
    - var now = new Date()
    - var nowYear = now.getFullYear()
    if theme.footer.owner.since && theme.footer.owner.since != nowYear
      .copyright!= `&copy;${theme.footer.owner.since} - ${nowYear} By ${config.author}`
    else
      .copyright!= `&copy;${nowYear} By ${config.author}`
```

把By替换成一个爱心标签
```javascript
#footer-wrap
  if theme.footer.owner.enable
    - var now = new Date()
    - var nowYear = now.getFullYear()
    if theme.footer.owner.since && theme.footer.owner.since != nowYear
      .copyright!= `&copy;${theme.footer.owner.since} - ${nowYear + '  '} <i id="heartbeat" style="color:#FF6A6A" class="fa fa-heartbeat"></i> ${config.author}`
    else
      .copyright!= `&copy;${nowYear + '  '} <i id="heartbeat" style="color:#FF6A6A" class="fa fa-heartbeat"></i> ${config.author}`
```
这时候你的页脚就有一个红心了，但是你会发现这颗心没有灵魂，因为它不会跳动，如果你还想要这颗心跳动，那还需要加点佐料
在`_config.butterfly.yml`文件找到 `head:`，添加下面的链接
```
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/HCLonely/images@master/others/heartbeat.min.css">
```

你也可以直接把这段代码插入到的最下方

```javascript
<head><link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/HCLonely/images@master/others/heartbeat.min.css"></head>
```
好啦，你的小红心就跳动起来了

## 新建文章自动在编辑器里打开

每次新建一篇文章`hexo new post ‘title’`，都需要去`\source\_posts\`目录下花时间寻找新建的文章，文章越来越多以后，效率越来越低，让人非常蛋疼

解决方法：在项目目录下建一个`scripts`的文件夹，注意是和`_config.yml`配置文件同一级，然后在`scripts`目录下建立`auto_open.js`文件（也可以叫其他名），写入如下代码
```javascript
var exec = require('child_process').exec;
// Hexo 2.x 用户复制这段
// hexo.on('new', function(path){
//    exec('open -a "Typora编辑器绝对路径.app" ' + path);
//});
// Hexo 3 用户复制这段
hexo.on('new', function(data){
    exec('open -a "Typora编辑器绝对路径.app" ' + data.path);
});
```
然后再创建文件时，`hexo`就会自动帮你在`markdown`编辑器打开你新建的文章

```shell
hexo new "title"
```






## 待更新

优化合集
https://ethant.top/articles/hexo541u/#%E4%BD%BF%E7%94%A8-1

https://akilar.top/posts/f99b208/

https://akilar.top/posts/7c16c4bb/


Hexo+github 搭建博客 (超级详细版，精细入微)
https://yafine-blog.cn/posts/4ab2.html


SEO优化
https://blog.sky03.cn/posts/42790.html#toc-heading-17
