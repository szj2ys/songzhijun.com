---
title: shell单引号和双引号区别
comments: false
tags:
  - shell
  - 教程
categories: shell
keywords: 'shell,教程'
abbrlink: c7921ac5
date: 2021-08-01 14:47:26
description:
top_img:
cover: https://img0.baidu.com/it/u=977407170,3032926308&fm=26&fmt=auto&gp=0.jpg
---


```shell
vim test.sh
```

```shell
#!/bin/bash
do_date=$1  

echo '$do_date'  # 英文字母的单引号 $do_date
echo "$do_date"  # 英文字母的双引号  2019-02-10
echo "'$do_date'"  # 英文字母的双引号包着单引号 '2019-02-10'
echo '"$do_date"'   # 英文字母的单引号包着双引号 "$do_date"
echo `date`   # 数字1旁边的反引号 可以写一些命令会把结果返回

```

```shell
test.sh 2019-02-10
```

结果：
```shell
$do_date
2019-02-10
'2019-02-10'
"$do_date"
2019年 05月 02日 星期四 21:02:08 CST
```
