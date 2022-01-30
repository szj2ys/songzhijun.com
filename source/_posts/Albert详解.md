---
title: Albert详解
tags:
  - Albert
keywords: Albert
comments: true
cover: 'https://img1.baidu.com/it/u=3365958451,2789961677&fm=253'
abbrlink: d661c569
date: 2022-01-24 20:54:41
updated: 2022-01-24 20:54:41
categories:
description:
top_img:
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

## 相比于BERT的改进

### 参数缩减方法
论文提出了2种模型参数压缩的方法，即embedding矩阵分解法以及层参数共享法，具体如下：

- 从模型角度来讲，wordPiece embedding是学习上下文独立的表征维度为$E$，而隐藏层embedding是 学习上下文相关的表征维度为$H$。为了应用的方便，原始的bert的向量维度$E=H$，这样一旦增加了$H$，$E$也就增大了。 ALBert提出向量参数分解法，将一个非常大的词汇向量矩阵分解为两个小矩阵，例如词汇量大小是$V$，向量维度是$E$，隐藏层向量为$H$，则 原始词汇向量参数大小为$V*H$，ALBert想将原始embedding映射到$V*E$（低纬度的向量），然后映射到隐藏空间$H$，这样参数量从 $V*H$下降到 $V*E+E*H$，参数量大大下降。但是要注意这样做的损失确保矩阵分解后的两个小矩阵的乘积损失，是一个有损的操作。

- 层之间参数共享。base的bert总共由12层的transformer的encoder部分组成，层参数共享方法避免了随着深度的加深带来的参数量的增大。 具体的共享参数有这几种，attention参数共享、ffn残差网络参数共享。

#### 对Embedding因式分解（Factorized embedding parameterization）

在BERT中，词embedding与encoder输出的embedding维度是一样的都是768。但是ALBERT认为，词级别的embedding是没有上下文依赖的表述，而隐藏层的输出值不仅包括了词本生的意思还包括一些上下文信息，理论上来说隐藏层的表述包含的信息应该更多一些，因此应该让H>>E，所以ALBERT的词向量的维度是小于encoder输出值维度的。

在NLP任务中，通常词典都会很大，embedding matrix的大小是E×V，如果和BERT一样让H=E，那么embedding matrix的参数量会很大，并且反向传播的过程中，更新的内容也比较稀疏。

结合上述说的两个点，ALBERT采用了一种因式分解的方法来降低参数量。首先把one-hot向量映射到一个低维度的空间，大小为E，然后再映射到一个高维度的空间，说白了就是先经过一个维度很低的embedding matrix，然后再经过一个高维度matrix把维度变到隐藏层的空间内，从而把参数量从$O(V×H)O(V×H)O(V×H)O(V×H)O(V×E+E×H)$，当E<<H时参数量减少的很明显。

下图是E选择不同值的一个实验结果，尴尬的是，在不采用参数共享优化方案时E设置为768效果反而好一些，在采用了参数共享优化方案时E取128效果更好一些。

#### 跨层的参数共享（Cross-layer parameter sharing）

在ALBERT还提出了一种参数共享的方法，Transformer中共享参数有多种方案，只共享全连接层，只共享attention层，ALBERT结合了上述两种方案，全连接层与attention层都进行参数共享，也就是说共享encoder内的所有参数，同样量级下的Transformer采用该方案后实际上效果是有下降的，但是参数量减少了很多，训练速度也提升了很多。

下图是BERT与ALBERT的一个对比，以base为例，BERT的参数是108M，而ALBERT仅有12M，但是效果的确相比BERT降低了两个点。由于其速度快的原因，我们再以BERT xlarge为参照标准其参数是1280M，假设其训练速度是1，ALBERT的xxlarge版本的训练速度是其1.2倍，并且参数也才223M，评判标准的平均值也达到了最高的88.7
除了上述说了训练速度快之外，ALBERT每一层的输出的embedding相比于BERT来说震荡幅度更小一些。下图是不同的层的输出值的L2距离与cosine相似度，可见参数共享其实是有稳定网络参数的作用的。
![](https://img-blog.csdnimg.cn/20191002155617541.png)


### 句间连贯（Inter-sentence coherence loss）
我们知道原始的Bert预训练的loss由两个任务组成，maskLM和NSP(Next Sentence Prediction)，maskLM通过预测mask掉的词语来实现真正的双向transformer， NSP类似于语义匹配的任务，预测句子A和句子B是否匹配，是一个二分类的任务，其中正样本从原始语料获得，负样本随机负采样。NSP任务可以 提高下游任务的性能，比如句子对的关系预测。但是也有论文指出NSP任务其实可以去掉，反而可以提高性能，比如RoBert。

论文以为NSP任务相对于MLM任务太简单了，学习到的东西也有限，因此论文提出了一个新的loss，sentence-order prediction(SOP)， SOP关注于句子间的连贯性，而非句子间的匹配性。SOP正样本也是从原始语料中获得，负样本是原始语料的句子A和句子B交换顺序。 举个例子说明NSP和SOP的区别，原始语料句子 A和B， NSP任务正样本是 AB，负样本是AC；SOP任务正样本是AB，负样本是BA。 可以看出SOP任务更加难，学习到的东西更多了（句子内部排序），可以学到句子中的内部顺序。
SOP任务也很简单，它的正例和NSP任务一致（判断两句话是否有顺序关系），反例则是判断两句话是否为反序关系。

BERT的NSP任务实际上是一个二分类，训练数据的正样本是通过采样同一个文档中的两个连续的句子，而负样本是通过采用两个不同的文档的句子。该任务主要是希望能提高下游任务的效果，例如NLI自然语言推理任务。但是后续的研究发现该任务效果并不好，主要原因是因为其任务过于简单。NSP其实包含了两个子任务，主题预测与关系一致性预测，但是主题预测相比于关系一致性预测简单太多了，并且在MLM任务中其实也有类型的效果。

这里提一下为啥包含了主题预测，因为正样本是在同一个文档中选取的，负样本是在不同的文档选取的，假如我们有2个文档，一个是娱乐相关的，一个是新中国成立70周年相关的，那么负样本选择的内容就是不同的主题，而正样都在娱乐文档中选择的话预测出来的主题就是娱乐，在新中国成立70周年的文档中选择的话就是后者这个主题了。

在ALBERT中，为了只保留一致性任务去除主题识别的影响，提出了一个新的任务 sentence-order prediction（SOP），SOP的正样本和NSP的获取方式是一样的，负样本把正样本的顺序反转即可。SOP因为实在同一个文档中选的，其只关注句子的顺序并没有主题方面的影响。并且SOP能解决NSP的任务，但是NSP并不能解决SOP的任务，该任务的添加给最终的结果提升了一个点。

### n-gram masking
BERT 的mask language model是直接对字进行masking，ALBERT使用n-gram masking，这其实和后面有人改进word masking一样，对中文进行分词，对词的masking比对字的masking性能会有一定的提升，所以ALBERT使用n-gram masking，其中n取值为1-3。

### 移除dropout
除了上面提到的三个主要优化点，ALBERT的作者还发现一个很有意思的点，ALBERT在训练了100w步之后，模型依旧没有过拟合，于是乎作者果断移除了dropout，没想到对下游任务的效果竟然有一定的提升。这也是业界第一次发现dropout对大规模的预训练模型会造成负面影响。

## 总结
在初闻ALBERT时，以为其减少了总的运算量，但实际上是通过参数共享的方式降低了内存，预测阶段还是需要和BERT一样的时间，如果采用了xxlarge版本的ALBERT，那实际上预测速度会更慢。

ALBERT解决的是训练时候的速度提升，如果要真的做到总体运算量的减少，的确是一个复杂且艰巨的任务，毕竟鱼与熊掌不可兼得。不过话说回来，ALBERT也更加适合采用feature base或者模型蒸馏等方式来提升最终效果。

ALBERT作者最后也简单提了下后续可能的优化方案，例如采用sparse attention或者block attention，这些方案的确是能真正降低运算量。其次，作者认为还有更多维度的特征需要去采用其他的自监督任务来捕获。



## REFERENCES

- [BERT你关注不到的点](https://zhuanlan.zhihu.com/p/242253766)

- [ALBert论文阅读笔记-缩减版的bert，模型参数更少，性能更好](https://zhuanlan.zhihu.com/p/88152893)

- [albert速度](https://blog.csdn.net/kyle1314608/article/details/106546529)

- [ALBERT真的瘦身成功了吗](https://zhuanlan.zhihu.com/p/102470776)

