---
title: Transforme详解
tags:
  - Transformer
keywords: Transformer、预训练模型
comments: true
abbrlink: 55aaffd6
date: 2022-01-24 20:40:46
updated: 2022-01-24 20:40:46
categories:
description:
top_img:
cover:
---



![](https://img-blog.csdnimg.cn/20200829000007683.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hpbnpoYW5neWFueGlhbmc=,size_16,color_FFFFFF,t_70#pic_center)

左边处理源语言，称之为Encoder，右边处理目标语言，被称为Decoder，分别由N个Block组成。然后每个block都有这么几个模块：

- Multi-Head Attention
- Masked Multi-Head Attention
- Add & Norm
- Feed Forward
- Positional Encoding
- Linear

其中， Feed Forward和Linear是神经网络的基本操作全连接层，Add & Norm以及延伸出来的一条侧边也是一个常见的神经网络结构残差连接


## attention

attention说白了就是权重计算和加权求和。图上的循环神经网络中的每一步都会输出一个向量，在预测目标语言到某一步时，用当前步的向量去和源语言中的每一步的向量去做内积，然后经过softmax得到归一化后的权重，再用权重去把源语言上的每一步的向量去做加权平均。然后做预测的时候也作为输入进入全连接层

### Multi-Head Attention

![](https://img-blog.csdnimg.cn/20200829000027768.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hpbnpoYW5neWFueGlhbmc=,size_16,color_FFFFFF,t_70#pic_center)

Multi-Head Attention是由多个Scaled Dot-Product Attention的函数组合而成的。
Scaled Dot-Product Attention的计算公式如下：

![](https://img-blog.csdnimg.cn/20200829000047826.png#pic_center)

首先计算q和k的点乘，然后除以 $\sqrt{d_k}$，经过softmax得到V上的权重分布，最后通过点乘计算V的加权值。这里$d_k$是K的维度，除以$\sqrt{d_k}$的原因是Q与K的转置相乘了，值会变大

首先我们看下原论文的解释：We suspect that for large values of dk, the dot products grow large in magnitude, pushing the softmax function into regions where it has extremely small gradients . To counteract this effect, we scale the dot products by 1/√dk .

原文说，因为加上softmax以后，会将推向小梯度范畴，导致于无法快速更新参数


通俗的理解：

- Q：query要去查的
- K： 等着被查的
- V： 实际的特征信息

在这里提两个问题：

问题1：Q,K,V是怎么来的？

答：输入的每个词经过Input Embedding后会变成一个向量，然后这个向量会分别经过一个矩阵变换得到Q,K,V。

问题2：Q,K,V分别的含义是什么?

答：Q代表Query，K代表Key，V代表Value。相对于上面的seq2seq+attention模型，这里做了一个attention概念上的拆分，Q和K去计算权重，V去和权重做加权平均。而在seq2seq+attention中相当于Q,K,V是一个向量。


### Masked Multi-Head Attention

之所以需要mask，是因为在目标语言上，每一步是预测下一个词，所以在预测下一个词的时候不能让模型看到下一个词以及之后的信息，所以在处理目标语言的时候需要对attention做mask，attention本来是一个二维矩阵，即每个位置对每个位置的权重，做了mask后就相当于强制一半的值（二维矩阵的右上三角）为0。这就是mask的含义。

## Encoder和Decoder

问：Encoder和Decoder是怎么联系的呢？ 

答：Decoder的每一个block比Encoder的block多一个Multi-Head Attention，这个的输入的K,V是Encoder这边的输出，由此，构建了Encoder和Decoder之间的信息传递。













## REFERENCES

- [Transformer: Attention的集大成者](https://blog.csdn.net/stdcoutzyx/article/details/108288834)

- [The Illustrated Transformer](http://jalammar.github.io/illustrated-transformer/)

- [通俗理解Transformer中的Attention机制](https://blog.csdn.net/weixin_42142630/article/details/114928214?spm=1001.2101.3001.6650.1&utm_medium=distribute.pc_relevant.none-task-blog-2%7Edefault%7ECTRLIST%7ERate-1.pc_relevant_default&depth_1-utm_source=distribute.pc_relevant.none-task-blog-2%7Edefault%7ECTRLIST%7ERate-1.pc_relevant_default&utm_relevant_index=2)


- [关于bert中softmax前除以维度d的理解](https://zhuanlan.zhihu.com/p/367120088)

