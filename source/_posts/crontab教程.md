---
title: crontab教程
tags:
  - crontab
  - 教程
categories: 教程
keywords: ''
cover: 'https://img0.baidu.com/it/u=3865956923,1416620645&fm=26&fmt=auto&gp=0.jpg'
comments: true
abbrlink: 7cb382c9
date: 2021-09-06 15:28:15
updated: 2021-09-06 15:28:15
description:
top_img:
---



大名鼎鼎的crontab就不用介绍了，直接上干货
## Crontab 命令


- **crontab -e**: 编辑 crontab 文件, 如果文件不存在则新建
- **crontab -l**: 列出crontab文件的内容
- **crontab -r**: 删除crontab文件



## Crontab 案例

每一分钟执行一次 /bin/ls：

```shell
*  *  *  *  *  /bin/ls
```

在 12 月内, 每天的早上 6 点到 12 点，每隔 3 个小时 0 分钟执行一次 /usr/bin/backup：
```shell
0  6-12/3  *  12  *  /usr/bin/backup
```
周一到周五每天下午 5:00 寄一封信给 alex@domain.name：
```shell
0  17  *  *  1-5 mail -s "hi" alex@domain.name <  /tmp/maildata
```
每月每天的午夜 0 点 20 分, 2 点 20 分, 4 点 20 分....执行 echo "haha"：
```shell
20  0-23/2  *  *  * echo "haha"
```
意思是每两个小时重启一次apache 
```shell
0  */2 * * * /sbin/service httpd restart
```
意思是每天7：50开启ssh服务  
```shell
50  7  *  *  *  /sbin/service sshd start
```
意思是每天22：50关闭ssh服务  
```shell
50  22  *  *  *  /sbin/service sshd stop
``` 
每月1号和15号检查/home 磁盘  
```shell
0  0  1,15  *  * fsck /home
``` 
每小时的第一分执行  /home/bruce/backup这个文件  
```shell
1  *  *  *  *  /home/bruce/backup
``` 
每周一至周五3点钟，在目录/home中，查找文件名为*.xxx的文件，并删除4天前的文件。  
```shell
00  03  *  *  1-5 find /home "*.xxx"  -mtime +4  -exec rm {} \; 
```
意思是每月的1、11、21、31日是的6：30执行一次ls命令
```shell
30  6  */10  *  * ls
```


### 更多 crontab 案例



| min | hour | day/month | month | day/week | Execution time |
| :---: | :---: | :---: | :---: | :---: | :---: |
| 30  | 0   | 1   | 1,6,12 | *   | — 00:30 Hrs on 1st of Jan, June & Dec. |
| 0   | 20  | *   | 10  | 1-5 | –8.00 PM every weekday (Mon-Fri) only in Oct. |
| 0   | 0   | 1,10,15 | *   | *   | — midnight on 1st ,10th & 15th of month |
| 5,10 | 0   | 10  | *   | 1   | — At 12.05,12.10 every Monday & on 10th of every month |
| ...  |     |     |     |     |     |

**注意：**当程序在你所指定的时间执行后，系统会发一封邮件给当前的用户，显示该程序执行的内容，若是你不希望收到这样的邮件，请在每一行空一格之后加上 \> /dev/null 2>&1 即可，如：
```shell
20  03  *  *  *  bash  /etc/profile/test.sh >  /dev/null  2>&1 
```






## REFERENCES
 - [Crontab – Quick Reference](https://www.adminschoice.com/crontab-quick-reference)
 - [RUNOOB crontab教程](https://www.runoob.com/linux/linux-comm-crontab.html)
