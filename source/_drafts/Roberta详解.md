---
title: Roberta详解
tags:
  - Roberta
keywords: 'Roberta'
comments: true
date: 2022-01-24 20:55:08
updated: 2022-01-24 20:55:08
categories:
description:
top_img:
cover:
---

## roberta三个训练改进：
- 去掉下一句预测(NSP)任务
  
- 动态掩码。BERT 依赖随机掩码和预测 token。原版的 BERT 实现在数据预处理期间执行一次掩码，得到一个静态掩码。 而 RoBERTa 
  使用了动态掩码：每次向模型输入一个序列时都会生成新的掩码模式。这样，在大量数据不断输入的过程中，模型会逐渐适应不同的掩码策略，学习不同的语言表征。 
  
- 文本编码。不管是GPT还是Bert，都是用的BPE的编码方式，BPE是Byte-Pair Encoding的简称，是介于字符和词语之间的一个表达方式，比如hello，可能会被拆成“he”, “ll”, “o”, 其中BPE的字典是从语料中统计学习到的。是用以解决OOV（out of vocab）问题的算法。
原始Bert中，采用的BPE字典是30k， Roberta中增大到了50K，相对于Bertbase和Bertlarge会增加15M/20M的参数。

- 大语料与更长的训练步数

- Large-Batch：现在越来越多的实验表明增大batch_size会使得收敛更快，最后的效果更好。原始的Bert中，batch_size=256，同时训练1M steps。
在Roberta中，实验了两个设置：
batch_size=2k, 训练125k steps。
batch_size=8k, 训练31k steps。
从结果中看，batch_size=2k时结果最好。




## 为什么动态掩码比静态掩码更加好？

原来Bert对每一个序列随机选择15%的Tokens替换成[MASK]，为了消除与下游任务的不匹配，还对这15%的Tokens进行（1）80%的时间替换成[MASK]；（2）10%的时间不变；（3）10%的时间替换成其他词。但整个训练过程，这15%的Tokens一旦被选择就不再改变，也就是说从一开始随机选择了这15%的Tokens，之后的N个epoch里都不再改变了。这就叫做静态Masking。

而RoBERTa一开始把预训练的数据复制10份，每一份都随机选择15%的Tokens进行Masking，也就是说，同样的一句话有10种不同的mask方式。然后每份数据都训练N/10个epoch。这就相当于在这N个epoch的训练中，每个序列的被mask的tokens是会变化的。这就叫做动态Masking。











## batch_size对模型效果的影响

1. batch_size设的大一些，收敛得块，也就是需要训练的次数少，准确率上升的也很稳定，但是实际使用起来精度不高。

2. batch_size设的小一些，收敛得慢，可能准确率来回震荡，因此需要把基础学习速率降低一些，但是实际使用起来精度较高。

结论： 
batch_size太小导致网络收敛不稳定，最后结果比较差。而batch_size太大会影响随机性的引入



## REFERENCES
- [Roberta: Bert调优](https://blog.csdn.net/stdcoutzyx/article/details/108883085?utm_medium=distribute.pc_relevant.none-task-blog-2~default~baidujs_baidulandingword~default-0.queryctrv2&spm=1001.2101.3001.4242.1&utm_relevant_index=3)






