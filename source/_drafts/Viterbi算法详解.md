---
title: Viterbi算法详解
tags:
  - Viterbi
keywords: 'Viterbi'
comments: true
date: 2022-02-08 14:22:31
updated: 2022-02-08 14:22:31
categories:
description:
top_img:
cover: https://img1.baidu.com/it/u=1368021057,3506905137&fm=253
---


维特比算法（Viterbi algorithm）是一种动态规划算法。它用于寻找最有可能产生观测事件序列的维特比路径——隐含状态序列，特别是在马尔可夫信息源上下文和隐马尔可夫模型中。

例如在统计句法分析中动态规划算法可以被用于发现最可能的上下文无关的派生(解析)的字符串，有时被称为“维特比分析”。

求所有路径中最优路径，最容易想到的就是暴力解法，直接把所有路径全部计算出来，然后找出最优的。这方法理论上是可行，但当序列很长时，时间复杂夫很高。而且进行了大量的重复计算，viterbi算法就是用动态规划的方法就减少这些重复计算。
viterbi算法是每次只需要保存到当前位置最优路径，之后循环向后走。到结束时，从最后一个时刻的最优值回溯到开始位置，回溯完成后，这个从开始到结束的路径就是最优的。

## REFERENCES
- [如何通俗地讲解 viterbi 算法？](https://www.zhihu.com/question/20136144)
- [通俗易懂理解——viterbi算法](https://zhuanlan.zhihu.com/p/40208596)
- [隐马尔可夫模型（HMM）及Viterbi算法](https://www.jianshu.com/p/b8b1e55e1f1a)
- [HMM模型和Viterbi算法](https://www.cnblogs.com/Denise-hzf/p/6612212.html)
- [隐马尔可夫(HMM)、前/后向算法、Viterbi算法 再次总结](https://blog.csdn.net/xueyingxue001/article/details/52396494)
- [52nlp：HMM相关文章索引](https://www.52nlp.cn/hmm%E7%9B%B8%E5%85%B3%E6%96%87%E7%AB%A0%E7%B4%A2%E5%BC%95)
- [百度百科：维特比算法](https://baike.baidu.com/item/%E7%BB%B4%E7%89%B9%E6%AF%94%E7%AE%97%E6%B3%95/7765534?fr=aladdin)