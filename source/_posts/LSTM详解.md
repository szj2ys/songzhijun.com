---
title: LSTM详解
tags:
  - LSTM
keywords: LSTM
cover: 'https://img1.baidu.com/it/u=3043404661,634103034&fm=253'
comments: true
abbrlink: b16b957b
date: 2022-02-07 15:18:51
updated: 2022-02-07 15:18:51
categories:
description:
top_img:
---

## 长期依赖(Long Term Dependencies)
传统的RNN节点输出仅由权值，偏置以及激活函数决定（图3）。RNN是一个链式结构，每个时间片使用的是相同的参数。
![](https://cdn.jsdelivr.net/gh/szj2ys/cdn/resources/rnn.png)

在深度学习领域中（尤其是RNN），“长期依赖“问题是普遍存在的。长期依赖产生的原因是当神经网络的节点经过许多阶段的计算后，之前比较长的时间片的特征已经被覆盖，例如下面例子
```
eg1: The cat, which already ate a bunch of food, was full.
      |   |     |      |     |  |   |   |   |     |   |
     t0  t1    t2      t3    t4 t5  t6  t7  t8    t9 t10
eg2: The cats, which already ate a bunch of food, were full.
      |   |      |      |     |  |   |   |   |     |    |
     t0  t1     t2     t3    t4 t5  t6  t7  t8    t9   t10
```
我们想预测'full'之前系动词的单复数情况，显然full是取决于第二个单词’cat‘的单复数情况，而非其前面的单词food。随着数据时间片的增加，RNN丧失了学习连接如此远的信息的能力。

## 梯度消失和梯度爆炸
梯度消失和梯度爆炸是困扰RNN模型训练的关键原因之一，产生梯度消失和梯度爆炸是由于RNN的权值矩阵循环相乘导致的，相同函数的多次组合会导致极端的非线性行为。梯度消失和梯度爆炸主要存在RNN中，因为RNN中每个时间片使用相同的权值矩阵。对于一个DNN，虽然也涉及多个矩阵的相乘，但是通过精心设计权值的比例可以避免梯度消失和梯度爆炸的问题。

处理梯度爆炸可以采用梯度截断的方法。所谓梯度截断是指将梯度值超过阈值 $\theta$ 的梯度手动降到 $\theta$ 。虽然梯度截断会一定程度上改变梯度的方向，但梯度截断的方向依旧是朝向损失函数减小的方向。

对比梯度爆炸，梯度消失不能简单的通过类似梯度截断的阈值式方法来解决，因为长期依赖的现象也会产生很小的梯度。在上面例子中，我们希望 $t_9$ 时刻能够读到 $t_1$ 时刻的特征，在这期间内我们自然不希望隐层节点状态发生很大的变化，所以 [$t_2, t_8$] 时刻的梯度要尽可能的小才能保证梯度变化小。很明显，如果我们刻意提高小梯度的值将会使模型失去捕捉长期依赖的能力。


## LSTM
LSTM的全称是Long Short Term Memory，顾名思义，它具有记忆长短期信息的能力的神经网络。
LSTM提出的动机是为了解决上面我们提到的长期依赖问题。
LSTM之所以能够解决RNN的长期依赖问题，是因为LSTM引入了门（gate）机制用于控制特征的流通和损失。

原始的 RNN 只有一个隐藏层的状态，即$h$，它对于短期的输入非常敏感。
再增加一个状态，即$c$，让它来保存长期的状态，称为单元状态(cell state)。
![](https://cdn.jsdelivr.net/gh/szj2ys/cdn/resources/rnn2lstm.png)
把上图按照时间维度展开：
![](https://cdn.jsdelivr.net/gh/szj2ys/cdn/resources/rnn2lstm2.png)

在 $t$ 时刻，LSTM 的输入有三个：当前时刻网络的输入值 $x_t$、上一时刻 LSTM 的输出值 $h_t-1$、以及上一时刻的单元状态 $c_t-1$；
LSTM 的输出有两个：当前时刻 LSTM 输出值 $h_t$、和当前时刻的单元状态 $c_t$

关键问题是：怎样控制长期状态 c ？

方法是：使用三个控制开关
![](https://cdn.jsdelivr.net/gh/szj2ys/cdn/resources/lstm_gates.png)

第一个开关，负责控制继续保存长期状态c；
第二个开关，负责控制把即时状态输入到长期状态c；
第三个开关，负责控制是否把长期状态c作为当前的LSTM的输出。

如何在算法中实现这三个开关？
方法：用 门（gate）

定义：gate 实际上就是一层全连接层，输入是一个向量，输出是一个 0到1 之间的实数向量。
公式为：
![](https://bbsmax.ikafan.com/static/L3Byb3h5L2h0dHBzL2ltZzIwMTguY25ibG9ncy5jb20vYmxvZy82OTc2ODcvMjAxOTAzLzY5NzY4Ny0yMDE5MDMyNjIwNDIxMTY0My04NDM1MjQxODAucG5n.jpg)
回忆一下它的样子：
![](https://cdn.jsdelivr.net/gh/szj2ys/cdn/resources/lstm_gate_math.png)

gate 如何进行控制？
方法：用门的输出向量按元素乘以我们需要控制的那个向量
原理：门的输出是 0到1 之间的实数向量，
当门输出为 0 时，任何向量与之相乘都会得到 0 向量，这就相当于什么都不能通过；
输出为 1 时，任何向量与之相乘都不会有任何改变，这就相当于什么都可以通过。

LSTM 的前向计算:
遗忘门（forget gate）
它决定了上一时刻的单元状态 $c_t-1$ 有多少保留到当前时刻 $c_t$

输入门（input gate）
它决定了当前时刻网络的输入 $x_t$ 有多少保存到单元状态 $c_t$

输出门（output gate）
控制单元状态 $c_t$ 有多少输出到 LSTM 的当前输出值 $h_t$


![](https://cdn.jsdelivr.net/gh/szj2ys/cdn/resources/lstm.png)

![](https://cdn.jsdelivr.net/gh/szj2ys/cdn/resources/lstm1.png)

![](https://cdn.jsdelivr.net/gh/szj2ys/cdn/resources/lstm2.png)

![](https://cdn.jsdelivr.net/gh/szj2ys/cdn/resources/lstm3.png)

![](https://cdn.jsdelivr.net/gh/szj2ys/cdn/resources/lstm4.png)

（１）遗忘门（forget gate）：
它决定了上一时刻的单元状态 $c_t-1$ 有多少保留到当前时刻 $c_t$

![](https://cdn.jsdelivr.net/gh/szj2ys/cdn/resources/lstm_forget_gate.png)
（２）输入门（input gate）：
它决定了当前时刻网络的输入 $x_t$ 有多少保存到单元状态 $c_t$
![](https://cdn.jsdelivr.net/gh/szj2ys/cdn/resources/lstm_input_gate.png)

（３）输出门（output gate）：
控制单元状态 $c_t$ 有多少输出到 LSTM 的当前输出值 $h_t$

![](https://cdn.jsdelivr.net/gh/szj2ys/cdn/resources/lstm_output_gate.png)

![](https://cdn.jsdelivr.net/gh/szj2ys/cdn/resources/lstm_update_state.png)

LSTM 的反向传播训练算法

主要有三步：

1. 前向计算每个神经元的输出值，一共有 5 个变量，计算方法就是前一部分：
![](https://cdn.jsdelivr.net/gh/szj2ys/cdn/resources/lstm_bp.png)
2. 反向计算每个神经元的误差项值。与 RNN 一样，LSTM 误差项的反向传播也是包括两个方向：
一个是沿时间的反向传播，即从当前 t 时刻开始，计算每个时刻的误差项；
一个是将误差项向上一层传播。

3. 根据相应的误差项，计算每个权重的梯度。

![](https://cdn.jsdelivr.net/gh/szj2ys/cdn/resources/lstm_state.png)


目标是要学习 8 组参数，如下图所示：
![](https://cdn.jsdelivr.net/gh/szj2ys/cdn/resources/lstm_bp2.png)
又权重矩阵 $W$ 都是由两个矩阵拼接而成，这两部分在反向传播中使用不同的公式，因此在后续的推导中，权重矩阵也要被写为分开的两个矩阵。

接着就来求两个方向的误差，和一个梯度计算。

- 误差项沿时间的反向传递：
定义 $t$ 时刻的误差项：
![](https://cdn.jsdelivr.net/gh/szj2ys/cdn/resources/lstm_bp3.png)
目的是要计算出 $t-1$ 时刻的误差项：
![](https://cdn.jsdelivr.net/gh/szj2ys/cdn/resources/lstm_bp4.png)


- 利用 $h_t$ $c_t$ 的定义，和全导数公式，可以得到 将误差项向前传递到任意$k$时刻的公式：
![](https://cdn.jsdelivr.net/gh/szj2ys/cdn/resources/lstm_bp5.png)


- 权重梯度的计算：
![](https://cdn.jsdelivr.net/gh/szj2ys/cdn/resources/lstm_bp6.png)


## LSTM优缺点
### 优点

- 有助于缓解梯度消失现象；

### 缺点
- $t$时刻的计算需要依赖于$t-1$时刻的值所以无法并行计算；


## REFERENCES 
- [详解 LSTM](https://www.bbsmax.com/A/nAJv8B1mdr/)
- [详解LSTM的使用方法及其不同变体的结构特征](https://www.sohu.com/a/128669963_642762)
- [LSTM原理详解](https://blog.csdn.net/qq_31278903/article/details/88690959)
- [大师兄：详解LSTM](https://zhuanlan.zhihu.com/p/42717426)
- [LSTM入门必读：从基础知识到工作方式详解](https://baijiahao.baidu.com/s?id=1573792228593933&wfr=spider&for=pc)
- [视频：LSTM架构讲解](https://www.zhihu.com/zvideo/1323002838411423744)
- [RNN 结构详解](https://www.jiqizhixin.com/articles/2018-12-14-4)
- [easyai：循环神经网络 – Recurrent Neural Network | RNN](https://easyai.tech/ai-definition/rnn/)
- [RNN/LSTM/GRU 详解+tensorflow使用](https://zhuanlan.zhihu.com/p/103182683)
- [LSTM架构详解](https://zhuanlan.zhihu.com/p/337700483)







