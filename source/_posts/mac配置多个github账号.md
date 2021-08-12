---
title: Mac配置多个Github账号
tags:
  - 标签
categories: 教程
keywords: ''
cover: 'https://img2.baidu.com/it/u=1235179948,3696932210&fm=26&fmt=auto&gp=0.jpg'
comments: true
abbrlink: 35811c74
date: 2021-08-12 09:52:44
updated: 2021-08-12 09:52:44
description:
top_img:
---


用Github绑定域名后博客网站有时会挂掉，还是原生的稳定些，因为一个Github账号只能部署一个Github Pages，所以就想把博客部署在不同的Github。
但是电脑只能有一个Github作为默认账号，用非默认账号提交代码会出现`Permission denied`错误。
那要怎么实现多个Github同时存在呢？


### 生成`ssh key`并上传Github
这个就太简单了，不想写，百度一下教程多的是，这里是[Github官方教程](https://docs.github.com/en/github/authenticating-to-github/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent#adding-your-ssh-key-to-the-ssh-agent)

### ~/.ssh/config文件配置
```shell
# 主Github账号，默认即可
Host github.com
HostName github.com
PreferredAuthentications publickey
IdentityFile ~/.ssh/id_rsa

# 第二个Github账号的配置，需要加上自己的用户名
Host iszj.github.com
HostName github.com
PreferredAuthentications publickey
IdentityFile ~/.ssh/id_rsa_iszj
```



### 测试是否配置成功

```shell
# 主账号测试命令
ssh -T git@github.com
# 次账号测试命令
ssh -T git@iszj.github.com
```
看到下面的输出就配置成功了
```shell
Hi szj2ys! You've successfully authenticated, but GitHub does not provide shell access.
```


如果这时去主账号的项目`git push`是可以上传的，但是在次账号的项目还是会还是会报错
```shell
identity_sign: private key /Users/songzhijun/.ssh/id_rsa contents do not match public
git@github.com: Permission denied (publickey).
fatal: Could not read from remote repository.

Please make sure you have the correct access rights
and the repository exists.
```
可以看到，它还是去找的主账号的`ssh key`，所以我们就需要让`git`找到项目对应的账号，做法是这样

### 查看项目采用的提交方式
```shell
git remote -v
```
如果是`https`需要换成`ssh`的方式

### 修改提交方式

先删除原来的提交方式
```shell
git remote rm origin
```
添加新的ssh提交方式，到github官网获取项目的ssh链接
主账号可以用这种方式，也可以不用`ssh`
```shell
git remote add origin git@github.com:xxx/test.git
```
次账号需要在`@`后面加上你的用户名
```shell
git remote add origin git@xxx.github.com:xxx/test.git
```
再`git remote -v`看看提交方式就变过来了，也就是说我们提交的时候可以找到对应的`ssh key`了，但如果这是你`git push`绝逼不成功，因为`git remote rm origin`把我们的项目和远程的关联解除了，所以需要设置一下

```shell
git push --set-upstream origin master
```
两个Github就完美的融合在你的电脑了


最后，再来解决一下我们的需求，把博客部署在多个`Github Pages`
在`hexo`部署博客的时候配置一下`_config.yml`

```shell
deploy:
  type: git
  repo:
    # 主账号Github
    - https://github.com/szj2ys/szj2ys.github.io.git
    # 次账号Github，必须用ssh方式
    - git@iszj.github.com:iszj/iszj.github.io.git
```


好啦，这下博客就会一次部署到多个Github，再也不怕网站打不开了，一句话舒爽顺滑，哈哈哈哈哈😂🤣✌️😃



