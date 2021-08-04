---
title: Centos7普通用户配置sudo免密
comments: true
tags:
  - shell
  - linux
  - 教程
categories: linux
keywords: 'linux,shell,教程'
abbrlink: 871dc6a0
date: 2021-08-01 14:51:16
description:
top_img:
cover: https://img0.baidu.com/it/u=1210832600,4269286676&fm=26&fmt=auto&gp=0.jpg
---

在Linux里当我们需要执行一条root权限的命令时，每次都要用sudo命令然后再确认密码，非常不方便。那么我们修改配置sudo免密。默认新建的用户不在sudo组，但可以编辑/etc/sudoers文件将普通用户加入sudo组。要注意的是修改该文件需要切换到root用户
使用命令 vi /etc/sudoers修改配置文件，将下列第三或第四行添加到文件中
- youuser ALL=(ALL) ALL
- %youuser ALL=(ALL) ALL
- youuser ALL=(ALL) NOPASSWD: ALL
- %youuser ALL=(ALL) NOPASSWD: ALL

>第一行:允许用户youuser执行sudo命令(需要输入密码).
第二行:允许用户组youuser里面的用户执行sudo命令(需要输入密码).
第三行:允许用户youuser执行sudo命令,并且在执行的时候不输入密码.
第四行:允许用户组youuser里面的用户执行sudo命令,并且在执行的时候不输入密码.

例如：

```
## Allow root to run any commands anywhere
root       ALL=(ALL)       ALL
%test      ALL=(ALL)       NOPASSWD: ALL

```
保存退出后，切换到普通用户，使用sudo命令再也不用输入密码确认了，是不是很方便:)

