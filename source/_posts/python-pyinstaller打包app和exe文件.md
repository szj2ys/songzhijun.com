---
title: Python程序用pyinstaller打包成app或exe文件
tags:
  - Python
  - pyinstaller
categories: Python教程
keywords: 'Python,pyinstaller,打包,Python教程'
abbrlink: 40aa2654
date: 2021-08-01 14:54:30
description:
cover: https://img1.baidu.com/it/u=1221253630,2795876430&fm=26&fmt=auto&gp=0.jpg
comments: false
---


当你写好了Python程序，想把自己做的程序发布给用户使用的时候，你会面对这样的问题：
- 不可能你的用户都是懂Python编程的人，你还要照顾那些普通用户
- 因为工具用了一些第三方库，不可能在每台电脑上对这些库逐一进行安装

如果你的程序任何人只要双击就能用，把你写出来的bugs从你自己的电脑中解放出来供全人类使用，是不是很棒？
[pyinstaller](https://pyinstaller.readthedocs.io/en/latest/usage.html)就是这么个帮你解决问题的帮手，他会帮你把需要的环境打包好封装到一个独立的应用中，让别人无忧使用。

## 准备材料
### 测试代码
我们准备画一只小猪的代码
```python
import turtle as tu

tu.pensize(4)  # 设置画笔的大小
tu.colormode(255)  # 设置GBK颜色范围为0-255
tu.color((255, 155, 192), "pink")  # 设置画笔颜色和填充颜色(pink)
tu.setup(850, 500)  # 设置主窗口的大小为850*500
tu.speed(10)  # 设置画笔速度为10

# 画鼻子部分
tu.pu()  # 提笔
tu.goto(-100, 100)  # 画笔前往坐标(-100,100)
tu.pd()  # 下笔
tu.seth(-30)  # 笔的角度为-30°
tu.begin_fill()  # 外形填充的开始标志
a = 0.4
for i in range(120):
    if 0 <= i < 30 or 60 <= i < 90:
        a = a + 0.08
        tu.lt(3)  # 向左转3度
        tu.fd(a)  # 向前走a的步长
    else:
        a = a - 0.08
        tu.lt(3)
        tu.fd(a)
tu.end_fill()  # 依据轮廓填充
tu.pu()  # 提笔
tu.seth(90)  # 笔的角度为90度
tu.fd(25)  # 向前移动25
tu.seth(0)  # 转换画笔的角度为0
tu.fd(10)
tu.pd()
tu.pencolor(255, 155, 192)  # 设置画笔颜色
tu.seth(10)
tu.begin_fill()
tu.circle(5)  # 画一个半径为5的圆
tu.color(160, 82, 45)  # 设置画笔和填充颜色
tu.end_fill()
tu.pu()
tu.seth(0)
tu.fd(20)
tu.pd()
tu.pencolor(255, 155, 192)
tu.seth(10)
tu.begin_fill()
tu.circle(5)
tu.color(160, 82, 45)
tu.end_fill()

# 画头部
tu.color((255, 155, 192), "pink")
tu.pu()
tu.seth(90)
tu.fd(41)
tu.seth(0)
tu.fd(0)
tu.pd()
tu.begin_fill()
tu.seth(180)
tu.circle(300, -30)  # 顺时针画一个半径为300,圆心角为30°的园
tu.circle(100, -60)
tu.circle(80, -100)
tu.circle(150, -20)
tu.circle(60, -95)
tu.seth(161)
tu.circle(-300, 15)
tu.pu()
tu.goto(-100, 100)
tu.pd()
tu.seth(-30)
a = 0.4
for i in range(60):
    if 0 <= i < 30 or 60 <= i < 90:
        a = a + 0.08
        tu.lt(3)  # 向左转3度
        tu.fd(a)  # 向前走a的步长
    else:
        a = a - 0.08
        tu.lt(3)
        tu.fd(a)
tu.end_fill()

# 画耳朵
tu.color((255, 155, 192), "pink")
tu.pu()
tu.seth(90)
tu.fd(-7)
tu.seth(0)
tu.fd(70)
tu.pd()
tu.begin_fill()
tu.seth(100)
tu.circle(-50, 50)
tu.circle(-10, 120)
tu.circle(-50, 54)
tu.end_fill()
tu.pu()
tu.seth(90)
tu.fd(-12)
tu.seth(0)
tu.fd(30)
tu.pd()
tu.begin_fill()
tu.seth(100)
tu.circle(-50, 50)
tu.circle(-10, 120)
tu.circle(-50, 56)
tu.end_fill()

# 画眼睛
tu.color((255, 155, 192), "white")
tu.pu()
tu.seth(90)
tu.fd(-20)
tu.seth(0)
tu.fd(-95)
tu.pd()
tu.begin_fill()
tu.circle(15)
tu.end_fill()
tu.color("black")
tu.pu()
tu.seth(90)
tu.fd(12)
tu.seth(0)
tu.fd(-3)
tu.pd()
tu.begin_fill()
tu.circle(3)
tu.end_fill()
tu.color((255, 155, 192), "white")
tu.pu()
tu.seth(90)
tu.fd(-25)
tu.seth(0)
tu.fd(40)
tu.pd()
tu.begin_fill()
tu.circle(15)
tu.end_fill()
tu.color("black")
tu.pu()
tu.seth(90)
tu.fd(12)
tu.seth(0)
tu.fd(-3)
tu.pd()
tu.begin_fill()
tu.circle(3)
tu.end_fill()

# 画腮
tu.color((255, 155, 192))
tu.pu()
tu.seth(90)
tu.fd(-95)
tu.seth(0)
tu.fd(65)
tu.pd()
tu.begin_fill()
tu.circle(30)
tu.end_fill()

# 画嘴
tu.color(239, 69, 19)
tu.pu()
tu.seth(90)
tu.fd(15)
tu.seth(0)
tu.fd(-100)
tu.pd()
tu.seth(-80)
tu.circle(30, 40)
tu.circle(40, 80)

# 画身体
tu.color("red", (255, 99, 71))
tu.pu()
tu.seth(90)
tu.fd(-20)
tu.seth(0)
tu.fd(-78)
tu.pd()
tu.begin_fill()
tu.seth(-130)
tu.circle(100, 10)
tu.circle(300, 30)
tu.seth(0)
tu.fd(230)
tu.seth(90)
tu.circle(300, 30)
tu.circle(100, 3)
tu.color((255, 155, 192), (255, 100, 100))
tu.seth(-135)
tu.circle(-80, 63)
tu.circle(-150, 24)
tu.end_fill()
# 手
tu.color((255, 155, 192))
tu.pu()
tu.seth(90)
tu.fd(-40)
tu.seth(0)
tu.fd(-27)
tu.pd()
tu.seth(-160)
tu.circle(300, 15)
tu.pu()
tu.seth(90)
tu.fd(15)
tu.seth(0)
tu.fd(0)
tu.pd()
tu.seth(-10)
tu.circle(-20, 90)
tu.pu()
tu.seth(90)
tu.fd(30)
tu.seth(0)
tu.fd(237)
tu.pd()
tu.seth(-20)
tu.circle(-300, 15)
tu.pu()
tu.seth(90)
tu.fd(20)
tu.seth(0)
tu.fd(0)
tu.pd()
tu.seth(-170)
tu.circle(20, 90)

# 画脚
tu.pensize(10)
tu.color((240, 128, 128))
tu.pu()
tu.seth(90)
tu.fd(-75)
tu.seth(0)
tu.fd(-180)
tu.pd()
tu.seth(-90)
tu.fd(40)
tu.seth(-180)
tu.color("black")
tu.pensize(15)
tu.fd(20)
tu.pensize(10)
tu.color((240, 128, 128))
tu.pu()
tu.seth(90)
tu.fd(40)
tu.seth(0)
tu.fd(90)
tu.pd()
tu.seth(-90)
tu.fd(40)
tu.seth(-180)
tu.color("black")
tu.pensize(15)
tu.fd(20)

# 画尾巴
tu.pensize(4)
tu.color((255, 155, 192))
tu.pu()
tu.seth(90)
tu.fd(70)
tu.seth(0)
tu.fd(95)
tu.pd()
tu.seth(0)
tu.circle(70, 20)
tu.circle(10, 330)
tu.circle(70, 30)
```
### 图标图片
打包后应用的图标

![图标图片](https://gitee.com/szj2ys/Pictures/raw/master/program/pig.jpg)

## 打包
```shell
pyinstaller -i pig.jpg -Fw pig.py
```
pyinstaller会根据你打包的平台打成对应的包，比如你在Windows执行的命令，pyinstaller就会打包成.exe文件，如果你在Mac打包，结果就是.app文件，文件会出现在工程文件目录下的 dist 文件夹中，大功告成！好好享受吧~

## [高级用法](https://pyinstaller.readthedocs.io/en/latest/spec-files.html)

### 添加外部数据
如果你的代码读取了外部数据集，pyinstaller不会自动帮你打包，这是你需要在.spec文件a=Analysis中配置datas：
例如:
```shell
datas=[
                 ( 'data/*', 'data' ),
                 ( 'data/chromedrivers/*', 'data/chromedrivers' ),
             ],
```
> *表示所有文件
> ()中左边是源文件地址，可以写绝对地址，也可以写当前项目的相对地址；右边是打包后包里面的地址，建议和相对地址相同

重点来了，改过之后，重新打包运行的命令就有所区别，之前是`pyinstaller -Fw xx.py`，现在我们需要运行命令`pyinstaller -Fw xx.spec`，否则pyinstaller会重新生成xx.spec文件把我们修改的数据覆盖


### 常用参数解释
```shell
pyinstaller -F 文件.py # 生成单个可执行文件
pyinstaller -w 文件.py # 去掉控制台窗口，对于执行文件没有多大的用处，一般用于GUI面板代码文件
pyinstaller -i 图标路径 # 表示可执行文件的图标
pyinstaller -c # 使用控制台无窗口
pyinstaller -D # 生成一个文件夹包括依赖文件
pyinstaller -p # 添加Python使用的第三方库
pyinstaller -K # 当包含tcl和tk也就是使用tkinter时加上-K参数
```
