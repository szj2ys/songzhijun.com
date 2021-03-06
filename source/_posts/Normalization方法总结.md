---
title: Normalization方法总结
tags:
  - Normalization
keywords: Normalization
comments: true
cover: 'https://img2.baidu.com/it/u=1097103630,2955584474&fm=253'
abbrlink: cf4456cd
date: 2022-01-29 15:26:03
updated: 2022-01-29 15:26:03
categories:
description:
top_img:
---

## 归一化（Normalization）
描述：

将数据映射到指定的范围，如：把数据映射到0～1或-1~1的范围之内处理。

作用：

- 数据映射到指定的范围内进行处理，更加便捷快速。
- 把有量纲表达式变成无量纲表达式，便于不同单位或量级的指标能够进行比较和加权。经过归一化后，将有量纲的数据集变成纯量，还可以达到简化计算的作用。


常见做法：Min-Max归一化

![](https://pic4.zhimg.com/80/v2-768d71b5ced77365e42b7b9e8108c903_720w.jpg)

## 标准化（Normalization）
注：在英文翻译中，归一化和标准化的翻译是一致的，而在实际使用中，我们需要根据实际的公式（或用途）去理解~

数据标准化方法有多种，如：直线型方法(如极值法、标准差法)、折线型方法(如三折线法)、曲线型方法(如半正态性分布)。不同的标准化方法，对系统的评价结果会产生不同的影响。其中，最常用的是Z-Score 标准化。

Z-Score 标准化
![](https://pic3.zhimg.com/80/v2-5e77b78462a8e2d91d19ffb12545f2e2_720w.jpg)
其中，$\mu$为数据均值（mean），$\sigma$为标准差（std）。

描述：
将原数据转换为符合均值为0，标准差为1的标准正态分布的新数据。

作用：

- 提升模型的收敛速度（加快梯度下降的求解速度）
- 提升模型的精度（消除量级和量纲的影响）
- 简化计算（与归一化的简化原理相同）

## 归一化和标准化的作用和区别

在很多情况下，归一化和标准化的效果区别不是很大。他们两者首先都是线性变化，基本维持了原始数据的分部特征。

1.显然归一化和标准化往往会压缩且平移了数据，这样做两大好处：避免分布数据偏移和远离导数饱和区。

2.归一化和标准化可以将每一层的网络输入都变成固定的分部。

3.从公式不难看出，归一化的缩放仅跟最大值和最小值有关，当数据具有离散值的时候，这种方式会造成一定的误差。但是标准化确发挥了每个数据的作用，对原有的数据特征保持的更好。标准化缩放不会有范围的限制，综上，如果你的场景要求不是一定要使数据维持在（0，1）范围内的话，通常用标准化是更稳妥的，而对于将数据需要压缩到1个范围内时，用归一化。

4.此外，归一化和标准化还可以将多组有量纲数据转成无量纲数据，消除量级和量纲的影响。

5.数据分部更集中，计算更加的简单快捷。

## 使用归一化/标准化会改变数据原来的规律吗？

归一化/标准化实质是一种线性变换，线性变换有很多良好的性质，这些性质决定了对数据改变后不会造成“失效”，反而能提高数据的表现，这些性质是归一化/标准化的前提。比如有一个很重要的性质：线性变换不会改变原始数据的数值排序。

## 如果是单纯想实现消除量级和量纲的影响，用Min-Max还是用Z-Score？

1、数据的分布本身就服从正态分布，使用Z-Score。

2、有离群值的情况：使用Z-Score。

这里不是说有离群值时使用Z-Score不受影响，而是，Min-Max对于离群值十分敏感，因为离群值的出现，会影响数据中max或min值，从而使Min-Max的效果很差。相比之下，虽然使用Z-Score计算方差和均值的时候仍然会受到离群值的影响，但是相比于Min-Max法，影响会小一点。

## 当数据出现离群点时，用什么方法？

当数据中有离群点时，我们可以使用Z-Score进行标准化，但是标准化后的数据并不理想，因为异常点的特征往往在标准化后容易失去离群特征，此时就可以用RobustScaler 针对离群点做标准化处理。


## Robust标准化（RobustScaler）
很多时候我们在机器学习中，或是其他模型都会经常见到一个词：鲁棒性。也就是Robust的音译。

计算机科学中，健壮性（英语：Robustness）是指一个计算机系统在执行过程中处理错误，以及算法在遭遇输入、运算等异常时继续正常运行的能力。 诸如模糊测试之类的形式化方法中，必须通过制造错误的或不可预期的输入来验证程序的健壮性。很多商业产品都可用来测试软件系统的健壮性。健壮性也是失效评定分析中的一个方面。

关于Robust,是这么描述的：

This Scaler removes the median（中位数） and scales the data according to the quantile range(四分位距离，也就是说排除了outliers).

Huber从稳健统计的角度系统地给出了鲁棒性3个层面的概念：

一是模型具有较高的精度或有效性，这也是对于机器学习中所有学习模型的基本要求；

二是对于模型假设出现的较小偏差，只能对算法性能产生较小的影响；

主要是：噪声（noise）

三是对于模型假设出现的较大偏差，不可对算法性能产生“灾难性”的影响。

主要是：离群点（outlier）

在机器学习，训练模型时，工程师可能会向算法内添加噪声（如对抗训练），以便测试算法的「鲁棒性」。可以将此处的鲁棒性理解述算法对数据变化的容忍度有多高。鲁棒性并不同于稳定性，稳定性通常意味着「特性随时间不变化的能力」，鲁棒性则常被用来描述可以面对复杂适应系统的能力，需要更全面的对系统进行考虑。

## REFERENCES

- [深度学习Normalization方法们的总结](https://zhuanlan.zhihu.com/p/269744099)

- [数据预处理——标准化/归一化](https://zhuanlan.zhihu.com/p/135473375)


