---
title: CRF和HMM详解
tags:
  - CRF
  - HMM
keywords: ''
comments: true
date: 2022-04-26 20:59:54
updated: 2022-04-26 20:59:54
categories:
description:
top_img:
cover: https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzihZxblAZHM2JB-XUHNl8n7ilicicly486w&usqp=CAU
---
生成式模型：估计的是联合概率分布，P(Y, X)=P(Y|X)*P(X)，由联合概率密度分布 P(X,Y)，然后求出条件概率分布 P(Y|X) 作为预测的模型，即生成模型公式为：P(Y|X)= P(X,Y)/ P(X)。基本思想是首先建立样本的联合概率密度模型 P(X,Y)，然后再得到后验概率 P(Y|X)，再利用它进行分类，其主要关心的是给定输入 X 产生输出 Y 的生成关系。

判别式模型：估计的是条件概率分布， P(Y|X)，是给定观测变量 X 和目标变量 Y 的条件模型。由数据直接学习决策函数 Y=f(X) 或者条件概率分布 P(Y|X) 作为预测的模型，其主要关心的是对于给定的输入 X，应该预测什么样的输出 Y。

所以，HMM 使用隐含变量生成可观测状态，其生成概率有标注集统计得到，是一个生成模型。其他常见的生成式模型有：Gaussian、 Naive Bayes、Mixtures of multinomials 等。

而 CRF 就像一个反向的隐马尔可夫模型（HMM），通过可观测状态判别隐含变量，其概率亦通过标注集统计得来，是一个判别模型。其他常见的判别式模型有：K 近邻法、感知机、决策树、逻辑斯谛回归模型、最大熵模型、支持向量机、提升方法等。



首先，CRF 是判别模型，对问题的条件概率分布建模，而 HMM 是生成模型，对联合概率分布建模。

可以将 HMM 模型看作 CRF 模型的一种特殊情况，即所有能用 HMM 解决的问题，基本上也都能用 CRF 解决，并且 CRF 还能利用更多 HMM 没有的特征。

CRF 可以用前一时刻和当前时刻的标签构成的特征函数，加上对应的权重来表示 HMM 中的转移概率，可以用当前时刻的标签和当前时刻对应的词构成的特征函数，加上权重来表示 HMM 中的发射概率。

所以 HMM 能做到的，CRF 都能做到。

另外，CRF 相比 HMM 能够利用更加丰富的标签分布信息，因为：
- CRFs can define a much larger set of features. Whereas HMMs are necessarily local in nature (because they’re constrained to binary transition and emission feature functions, which force each word to depend only on the current label and each label to depend only on the previous label), CRFs can use more global features. For example, one of the features in our POS tagger above increased the probability of labelings that tagged the first word of a sentence as a VERB if the end of the sentence contained a question mark.（HMM 只能使用局部特征，转移概率只依赖前一时刻和当前时刻，发射概率只依赖当前时刻，CRF 能使用更加全局的特征，例如词性标注问题中，如果句子末尾出现问号“？”，则句首第一个词是动词的概率更高。）

- CRFs can have arbitrary weights. Whereas the probabilities of an HMM must satisfy certain constraints (e.g., 0<=p(wi|li)<=1,∑wp(wi=w|l1)=1)0<=p(wi|li)<=1,∑wp(wi=w|l1)=1), the weights of a CRF are unrestricted (e.g., logp(wi|li)log⁡p(wi|li) can be anything it wants).（HMM 中的概率具有一定的限制条件，如0到1之间、概率和为1等，而 CRF 中特征函数对应的权重大小没有限制，可以为任意值）



总结：
- HMM -> MEMM： HMM模型中存在两个假设：一是输出观察值之间严格独立，二是状态的转移过程中当前状态只与前一状态有关。但实际上序列标注问题不仅和单个词相关，而且和观察序列的长度，单词的上下文，等等相关。MEMM解决了HMM输出独立性假设的问题。因为HMM只限定在了观测与状态之间的依赖，而MEMM引入自定义特征函数，不仅可以表达观测之间的依赖，还可表示当前观测与前后多个状态之间的复杂依赖。
- MEMM -> CRF:CRF不仅解决了HMM输出独立性假设的问题，还解决了MEMM的标注偏置问题，MEMM容易陷入局部最优是因为只在局部做归一化，而CRF统计了全局概率，在做归一化时考虑了数据在全局的分布，而不是仅仅在局部归一化，这样就解决了MEMM中的标记偏置的问题。使得序列标注的解码变得最优解。
- HMM、MEMM属于有向图，所以考虑了x与y的影响，但没讲x当做整体考虑进去（这点问题应该只有HMM）。CRF属于无向图，没有这种依赖性，克服此问题。


## HMM和CRF对比
同：
- 都是图概率模型
- 都可用于序列标注这类问题上

异：
- HMM是生成模型，CRF是判别模型
- HMM是概率有向图，CRF是概率无向图
- HMM模型中存在两个假设：
  - 齐次马尔科夫假设：隐藏状态满足马尔科夫链，隐藏的马尔科夫链在任意时刻$t$的状态只依赖于其前一时刻的状态，与其他时刻的状态及观测无关，也与$t$时刻无关；翻译成白话就是状态的转移过程中当前状态只与前一状态有关；
  - 观测独立性假设：假设在任意时刻的观测只依赖于该时刻的马尔科夫链状态，与其他转测状态无关。但实际上序列标注问题不仅和单个词相关，而且和观察序列的长度，单词的上下文，等等相关。

CRF不仅解决了HMM输出独立性假设的问题，还解决了MEMM的标注偏置问题，MEMM容易陷入局部最优是因为只在局部做归一化，而CRF统计了全局概率，在做归一化时考虑了数据在全局的分布，而不是仅仅在局部归一化，这样就解决了MEMM中的标记偏置的问题。使得序列标注的解码变得最优解。
HMM、MEMM属于有向图，所以考虑了x与y的影响，但没讲x当做整体考虑进去（这点问题应该只有HMM）。CRF属于无向图，没有这种依赖性，克服此问题。

HMM的观测独立性假设使得HMM的输出之间相互独立，在序列标注问题中不能考虑词语与词语间的上下文特征。但是CRF引入自定义状态特征函数，不仅可以表达观测之间的依赖，还可表示当前观测与前后多个状态之间的复杂依赖。

## CRF比HMM更强大, 更广泛
CRF可以定义更广泛的特征函数：HMM受限于相邻位置的状态转换（二元转换）和发射概率函数，迫使每个单词仅依赖于当前标签，并且每个标签仅依赖于前一个标签。而CRF可以使用更多样的全局特征。例如，如果句子的结尾包含问号，则可以给给CRF模型增加一个特征函数，记录此时将句子的第一个单词标记为VERB的概率。这使得CRF可以使用长距离依赖的特征。
CRF可以有任意的权重值：HMM的概率值必须满足特定的约束， 而CRF的权重值是不受限制的。
CRF既具有判别式模型的优点，又考虑到长距离上下文标记间的转移概率，以序列化形式进行全局参数优化和解码的特点，解决了其他判别式模型(如MEMM)难以避免的标记偏见问题。


生成式模型的优点是:

实际上带的信息要比判别模型丰富， 研究单类问题比判别模型灵活性强
能更充分的利用先验知识
模型可以通过增量学习得到 （实验过）
缺点也很明显:

学习过程比较复杂;
在目标分类问题中准确度不高
而判别式模型的优点是：

分类边界更灵活，比生成模型实验效果好
能清晰的分辨出多类或某一类与其他类之间的差异特征
适用于较多类别的识别
缺点是：

不能反映训练数据本身的特性。
能力有限，可以分类, 但无法把整个场景描述出来。





## REFERENCES
- [条件随机场（CRF）和隐马尔科夫模型（HMM）最大区别在哪里？CRF的全局最优体现在哪里？](https://www.zhihu.com/question/53458773)
- [NLP第8课：从自然语言处理角度看 HMM 和 CRF](https://zhuanlan.zhihu.com/p/112362880)
- [从HMM、MEMM到CRF](https://zhuanlan.zhihu.com/p/71190655)
- [如何用简单易懂的例子解释条件随机场（CRF）模型？它和HMM有什么区别？](https://www.zhihu.com/question/35866596)
- [一文详细解读马尔可夫链蒙特卡罗算法](https://zhuanlan.zhihu.com/p/108258020)









