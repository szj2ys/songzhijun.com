---
title: Albert详解
tags:
  - Albert
keywords: 'Albert'
comments: true
date: 2022-01-24 20:54:41
updated: 2022-01-24 20:54:41
categories:
description:
top_img: https://img1.baidu.com/it/u=3365958451,2789961677&fm=253&fmt=auto&app=138&f=JPEG?w=999&h=480
cover:
---

### Bert超参数的分布
红色部分是embedding层，蓝色部分是encoder，注意蓝色部分总共有12个。

这两部分的参数分别是，其中每个encoder参数是0.85亿/12=700万
![](https://pic2.zhimg.com/v2-a44344b6154cdeabe84908d5851ad42d_r.jpg)
![](https://pic2.zhimg.com/v2-cd3028f90168598baa167681624d8dcd_r.jpg)

讲了BERT的参数分布，再说一下ALBERT对BERT的参数减少是从哪个方向。

一，12个encoder换成一个encoder，但是这个encoder会encode12次，这样encoder参数直接从84M变成7M，少了77M参数。

二，从embedding层参数最大的word embedding下手，原来word embedding的参数是

$$word\_num*embedding\_dim$$

记为$V*H$，这里用$H$因为encoder要保持向量为$H$的大小，下面进行参数减少改造，仅需通过一个低维空间$E$作为中转，由$V*H$变为$V*E+E*H$

比如语料库单词数为3W，$embedding_dim=768$，没改造的参数量为$30000*768=23M$

改造后假设$E$为128，$30000*128 + 128*768 =4M$，少了19M参数。

由此ALBERT由BERT的110M减少96M变成14M参数。


## REFERENCES

- [BERT你关注不到的点](https://zhuanlan.zhihu.com/p/242253766)

