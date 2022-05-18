---
title: Python并行编程
tags:
  - 并行编程
  - 程序执行效率优化
keywords: ''
comments: true
date: 2022-04-24 11:33:44
updated: 2022-04-24 11:33:44
categories:
description:
top_img:
cover: https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_-RERdPyRF1BfUce1mm9UploZ4Yn-kZZkjw&usqp=CAU
---

在进程、线程和协程的使用上，初学者之所以感到困惑，最主要的原因是对任务的理解不到位。任务是由一个进程、或者线程、或者协程独立完成的、相对独立的一系列工作组合。通常，我们会把任务写成一个函数。任务有3种类型：

- 计算密集型任务：任务包含大量计算，CPU占用率高
- IO密集型任务：任务包含频繁的、持续的网络IO和磁盘IO
- 混合型任务：既有计算也有IO




## 线程

### 线程的最大意义在于多任务并行

通常，代码是单线程顺序执行的，这个线程就是主线程。仅有主线程的话，在同一时刻就只能做一件事情；如果有多件事情要做，那也只能做完一件再去做另一件。
下面这个题目，就是一个需要同时做两件事情的例子。
>请写一段代码，提示用户从键盘输入任意字符，然后等待用户输入。如果用户在10秒钟完成输入（按回车键），则显示输入内容并结束程序；否则，不再等待用户输入，而是直接提示超时并结束程序。
>
>
我们知道，input()函数用于从键盘接收输入，time.sleep()函数可以令程序停止运行指定的时长。不过，在等待键盘输入的时候，sleep()函数就无法计时，而在休眠的时候，input()函数就无法接收键盘输入。不借助于线程，我们无法同时做这两件事情。如果使用线程技术的话，我们可以在主线程中接收键盘输入，在子线程中启动sleep()函数，一旦休眠结束，子线程就杀掉主线程，结束程序。

```python
import os, time
import threading

def monitor():
    time.sleep(10)
    print('\n超时退出！')
    os._exit(0)

m = threading.Thread(target=monitor)
m.setDaemon(True)
m.start()

s = input('请输入>>>')
print('接收到键盘输入：%s'%s)
print('程序正常结束。')
```



- [Python的进程、线程和协程的适用场景和使用技巧](https://bbs.huaweicloud.com/blogs/289318)









