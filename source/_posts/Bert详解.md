---
title: Bert详解
tags:
  - Bert
keywords: 'Bert,预训练模型'
comments: true
top_img: 
abbrlink: f06b97c0
date: 2022-01-24 20:50:06
updated: 2022-01-24 20:50:06
categories:
description:
cover: https://img1.baidu.com/it/u=137246240,1680214152&fm=253
sticky: 100
---


## Bert含义
BERT模型的全称是：BidirectionalEncoder Representations from Transformer。双向Transformer编码表达，其中双向指的是attention矩阵中，每个字都包含前后所有字的信息。

BERT模型的目标是利用大规模无标注语料训练、获得文本的包含丰富语义信息的Representation，即：文本的语义表示，然后将文本的语义表示在特定NLP任务中作微调，最终应用于该NLP任务。


## 模型结构
Bert依然是依赖Transformer模型结构，我们知道GPT采用的是Transformer中的Decoder部分的模型结构，当前位置只能attend到之前的位置。而Bert中则没有这样的限制，因此它是用的Transformer的Encoder部分。

而Transformer是由一个一个的block组成的，其主要参数如下：

L: 多少个block
H: 隐含状态尺寸，不同block上的隐含状态尺寸一般相等，这个尺寸单指多头注意力层的尺寸，有一个惯例就是在Transformer Block中全连接层的尺寸是多头注意力层的4倍。所以指定了H相当于是把Transformer Block里的两层隐含状态尺寸都指定了。
A: 多头注意力的头的个数
有了这几个参数后，就可以定义不同配置的模型了，Bert中定义了两个模型，
BertBase和BertLarge。其中：

BertBase: L=12, H=768, A=12, 参数量110M。
BertLarge: L=24, H=1024, A=16, 参数量340M。

输入输出
为了让Bert能够处理下游任务，Bert的输入是两个句子，中间用分隔符分开，在开头加一个特殊的用于分类的字符。即Bert的输入是: [CLS] sentence1 [SEP] sentence2。

其中，两个句子对应的词语对应的embedding还要加上位置embedding和标明token属于哪个句子的embedding。如下图所示：
![](https://cdn.jsdelivr.net/gh/szj2ys/cdn/resources/bert_embedding.jpg)
在[CLS]上的输出我们认为是输入句子的编码。
输入最长是512。

position embedding的结构为`[max sequence leghth, embedding dimension]`
论文给出如下公示求解位置信息：
- $PE(pos,2i)=sin(pos/10000^{2i/d})$
- $PE(pos,2i+1)=cos(pos/10000^{2i/d})$

这里的pos是字的位置，取值为`[0, max sequence length]`，i是维度的位置，设embedding dimension = 256，则$i \in [0, 255)$。d为维度的总数，即256。

## Bert的训练数据生成和解读
用于训练的文本材料是以行排列的句子。

首先读取一行句子，以：“工时填写。”为例，该句子会被认为是一个document和一个chunk，认定只有一个句子后，会随机从其他行的句子中挑一个出来，与该句组合成如下的结构：

```shell
[‘[CLS]’, ‘工’, ‘时’, ‘填’, ‘写’, ‘[SEP]’, ‘平’, ‘安’, ‘好’, ‘医’, ‘生’, ‘非, ‘常’, ‘优’, ‘秀’, ‘[SEP]’]
```


当然，在组合数据的过程中，会随机有如下的调整：

在mask的个数范围之内，此处举例有3个mask，其中有80%的概率某字会变成’[MASK]’，有10%的概率不会变化，有10%的概率会随机用另一个字代替它，接下来可能会变化成如下的内容：
```shell
[‘[CLS]’, ‘工’, ‘时’, ‘[MASK]’, ‘写’, ‘[SEP]’, ‘平’, ‘安’, ‘好’, ‘特’, ‘生’, ‘非, ‘常’, ‘优’, ‘秀’, ‘[SEP]’]。
```
同时我们也会得到相应的mask信息：

- segment_ids：这是一个list，用于区分句子之间的覆盖的范围，对应上述内容，其值为[0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]；

- is_random_next：这是一个重点，它表示两句话之间是否有上下文关系，注意，这里的random，这表示该变量如果是True，则两句没有上下文关系，这是一个随机生成的句子对。当每个document中只有一个句子时一定会随机找一个对子与之配对，如果是两个有关的句子，则有50%的概率随机找一个句子与前一个句子配对；

- masked_lm_positions：这是一个list，表示本句中出现掩码的位置，其值为[3, 6, 9]；

- masked_lm_labels：这是一个list，是与position对应的字，其值为[‘填’, ‘平’, ‘医’]；

上述所有信息会封装在一个instance对象中。


## Bert的输入输出
在基于深度神经网络的NLP方法中，文本中的字/词通常都用一维向量来表示（一般称之为“词向量”）；在此基础上，神经网络会将文本中各个字或词的一维词向量作为输入，经过一系列复杂的转换后，输出一个一维词向量作为文本的语义表示。特别地，我们通常希望语义相近的字/词在特征向量空间上的距离也比较接近，如此一来，由字/词向量转换而来的文本向量也能够包含更为准确的语义信息。因此，BERT模型的主要输入是文本中各个字/词的原始词向量，该向量既可以随机初始化，也可以利用Word2Vector等算法进行预训练以作为初始值；输出是文本中各个字/词融合了全文语义信息后的向量表示，如下图所示
![](https://cdn.jsdelivr.net/gh/szj2ys/cdn/resources/bert_input.png)
从上图中可以看出，BERT模型通过查询字向量表将文本中的每个字转换为一维向量，作为模型输入；模型输出则是输入各字对应的融合全文语义信息后的向量表示。此外，模型输入除了字向量，还包含另外两个部分：

1. 文本向量：该向量的取值在模型训练过程中自动学习，用于刻画文本的全局语义信息，并与单字/词的语义信息相融合

2. 位置向量：由于出现在文本不同位置的字/词所携带的语义信息存在差异（比如：“我爱你”和“你爱我”），因此，BERT模型对不同位置的字/词分别附加一个不同的向量以作区分

最后，BERT模型将字向量、文本向量和位置向量的加和作为模型输入。特别地，在目前的BERT模型中，文章作者还将英文词汇作进一步切割，划分为更细粒度的语义单位（WordPiece），例如：将playing分割为play和ing；此外，对于中文，目前作者尚未对输入文本进行分词，而是直接将单字作为构成文本的基本单位。

对于不同的NLP任务，模型输入会有微调，对模型输出的利用也有差异，例如：

单文本分类任务：对于文本分类任务，BERT模型在文本前插入一个[CLS]符号，并将该符号对应的输出向量作为整篇文本的语义表示，用于文本分类，如下图所示。可以理解为：与文本中已有的其它字/词相比，这个无明显语义信息的符号会更“公平”地融合文本中各个字/词的语义信息。
![](https://cdn.jsdelivr.net/gh/szj2ys/cdn/resources/bert_cls.png)
语句对分类任务：该任务的实际应用场景包括：问答（判断一个问题与一个答案是否匹配）、语句匹配（两句话是否表达同一个意思）等。对于该任务，BERT模型除了添加[CLS]符号并将对应的输出作为文本的语义表示，还对输入的两句话用一个[SEP]符号作分割，并分别对两句话附加两个不同的文本向量以作区分，如下图所示

![](https://cdn.jsdelivr.net/gh/szj2ys/cdn/resources/bert_pair.png)


序列标注任务：该任务的实际应用场景包括：中文分词&新词发现（标注每个字是词的首字、中间字或末字）、答案抽取（答案的起止位置）等。对于该任务，BERT模型利用文本中每个字对应的输出向量对该字进行标注（分类），如下图所示(B、I、E分别表示一个词的第一个字、中间字和最后一个字)。
![](https://cdn.jsdelivr.net/gh/szj2ys/cdn/resources/bert_seq_label.png)

根据具体任务的不同，在实际应用中我们可以脑洞大开，通过调整模型的输入、输出将模型适配到真实业务场景中。
## Bert的预训练任务
BERT实际上是一个语言模型。语言模型通常采用大规模、与特定NLP任务无关的文本语料进行训练，其目标是学习语言本身应该是什么样的，这就好比我们学习语文、英语等语言课程时，都需要学习如何选择并组合我们已经掌握的词汇来生成一篇通顺的文本。回到BERT模型上，其预训练过程就是逐渐调整模型参数，使得模型输出的文本语义表示能够刻画语言的本质，便于后续针对具体NLP任务作微调。为了达到这个目的，BERT文章作者提出了两个预训练任务：Masked LM和Next Sentence Prediction。
### Masked Language Model

一般语言模型建模的方式是从左到右或者从右到左，这样的损失函数都很直观，即预测下一个词的概率。

而Bert这种双向的网络，使得下一个词这个概念消失了，没有了目标，如何做训练呢？

答案就是完形填空，在输入中，把一些词语遮挡住，遮挡的方法就是用[Mask]这个特殊词语代替。而在预测的时候，就预测这些被遮挡住的词语。其中遮挡词语占所有词语的15%，且是每次随机Mask。
![](https://cdn.jsdelivr.net/gh/szj2ys/cdn/resources/bert_masked_lm.png)

但这有一个问题：在预训练中会[Mask]这个词语，但是在下游任务中，是没有这个词语的，这会导致预训练和下游任务的不匹配。

> 
>不匹配的意思我理解就是在预训练阶段任务中，模型会学到句子中有被遮挡的词语，模型要去学习它，而在下游任务中没有，但是模型会按照预训练的习惯去做，会导致任务的不匹配。



解决的办法就是不让模型意识到有这个任务的存在，具体做法就是在所有Mask的词语中，有80%的词语继续用[Mask]特殊词语，有10%用其他词语随机替换，有10%的概率保持不变。这样，模型就不知道当前句子中有没[Mask]的词语了。

这么做的主要原因是：
- 在后续微调任务中语句中并不会出现[MASK]标记；
- 这么做的另一个好处是：预测一个词汇时，模型并不知道输入对应位置的词汇是否为正确的词汇（10%概率），这就迫使模型更多地依赖于上下文信息去预测词汇，并且赋予了模型一定的纠错能力。

我们知道80%[mask]是为了让bert获得双向语言的语义表征，但是为什么还有另外20%的情况被另外处理，为啥？
原论文说如果100%mask会导致training见不到某些token而对fine-tuning阶段也有影响，所以肯定不能全都做mask。

为什么有10%保持不变，就是为了解决我们前面那个问题，让模型可以看到这些词，从而降低出现没看过情况。

为什么又10%用随机token，因为如果不用随机token替换一下，模型很可能已经记住那个位置应该填什么，使得模型的词汇多样性减少了，比如本来可以填写水果一类的词，但是只填apple。




### Next Sentence Prediction
当年大学考英语四六级的时候，大家应该都做过段落重排序，即：将一篇文章的各段打乱，让我们通过重新排序把原文还原出来，这其实需要我们对全文大意有充分、准确的理解。Next Sentence Prediction任务实际上就是段落重排序的简化版：只考虑两句话，判断是否是一篇文章中的前后句。在实际预训练过程中，文章作者从文本语料库中随机选择50%正确语句对和50%错误语句对进行训练，与Masked LM任务相结合，让模型能够更准确地刻画语句乃至篇章层面的语义信息。
在很多下游任务中，需要判断两个句子之间的关系，比如QA问题，需要判断一个句子是不是另一个句子的答案，比如NLI(Natural Language Inference)问题，直接就是两个句子之间的三种关系判断。

因此，为了能更好的捕捉句子之间的关系，在预训练的时候，就做了一个句子级别的损失函数，这个损失函数的目的很简单，就是判断第二个句子是不是第一个句子的下一句。训练时，会随机选择生成训练语料，50%的时下一句，50%的不是。

### 总结
BERT模型通过对Masked LM任务和Next Sentence Prediction任务进行联合训练，使模型输出的每个字/词的向量表示都能尽可能全面、准确地刻画输入文本（单句或语句对）的整体信息，为后续的微调任务提供更好的模型参数初始值。

## Bert模型结构
BERT模型的全称是：BidirectionalEncoder Representations from Transformer，也就是说，Transformer是组成BERT的核心模块，而Attention机制又是Transformer中最关键的部分，因此，下面我们从Attention机制开始，介绍如何利用Attention机制构建Transformer模块，在此基础上，用多层Transformer组装BERT模型。

### Attention机制

Attention: Attention机制的中文名叫“注意力机制”，顾名思义，它的主要作用是让神经网络把“注意力”放在一部分输入上，即：区分输入的不同部分对输出的影响。这里，我们从增强字/词的语义表示这一角度来理解一下Attention机制。

我们知道，一个字/词在一篇文本中表达的意思通常与它的上下文有关。比如：光看“鹄”字，我们可能会觉得很陌生（甚至连读音是什么都不记得吧），而看到它的上下文“鸿鹄之志”后，就对它立马熟悉了起来。因此，字/词的上下文信息有助于增强其语义表示。同时，上下文中的不同字/词对增强语义表示所起的作用往往不同。比如在上面这个例子中，“鸿”字对理解“鹄”字的作用最大，而“之”字的作用则相对较小。为了有区分地利用上下文字信息增强目标字的语义表示，就可以用到Attention机制。

Attention机制主要涉及到三个概念：Query、Key和Value。在上面增强字的语义表示这个应用场景中，目标字及其上下文的字都有各自的原始Value，Attention机制将目标字作为Query、其上下文的各个字作为Key，并将Query与各个Key的相似性作为权重，把上下文各个字的Value融入目标字的原始Value中。如下图所示，Attention机制将目标字和上下文各个字的语义向量表示作为输入，首先通过线性变换获得目标字的Query向量表示、上下文各个字的Key向量表示以及目标字与上下文各个字的原始Value表示，然后计算Query向量与各个Key向量的相似度作为权重，加权融合目标字的Value向量和各个上下文字的Value向量，作为Attention的输出，即：目标字的增强语义向量表示。


![](https://cdn.jsdelivr.net/gh/szj2ys/cdn/resources/bert_attention.png)

Self-Attention:对于输入文本，我们需要对其中的每个字分别增强语义向量表示，因此，我们分别将每个字作为Query，加权融合文本中所有字的语义信息，得到各个字的增强语义向量，如下图所示。在这种情况下，Query、Key和Value的向量表示均来自于同一输入文本，因此，该Attention机制也叫Self-Attention。
![](https://cdn.jsdelivr.net/gh/szj2ys/cdn/resources/bert_self_attention.png)

Multi-head Self-Attention:为了增强Attention的多样性，文章作者进一步利用不同的Self-Attention模块获得文本中每个字在不同语义空间下的增强语义向量，并将每个字的多个增强语义向量进行线性组合，从而获得一个最终的与原始字向量长度相同的增强语义向量，如下图所示。
![](https://cdn.jsdelivr.net/gh/szj2ys/cdn/resources/bet_multi_head_attention.png)

这里，我们再给出一个例子来帮助理解Multi-head Self-Attention（注：这个例子仅用于帮助理解，并非严格正确）。看下面这句话：“南京市长江大桥”，在不同语义场景下对这句话可以有不同的理解：“南京市/长江大桥”，或“南京市长/江大桥”。对于这句话中的“长”字，在前一种语义场景下需要和“江”字组合才能形成一个正确的语义单元；而在后一种语义场景下，它则需要和“市”字组合才能形成一个正确的语义单元。我们前面提到，Self-Attention旨在用文本中的其它字来增强目标字的语义表示。在不同的语义场景下，Attention所重点关注的字应有所不同。因此，Multi-head Self-Attention可以理解为考虑多种语义场景下目标字与文本中其它字的语义向量的不同融合方式。可以看到，Multi-head Self-Attention的输入和输出在形式上完全相同，输入为文本中各个字的原始向量表示，输出为各个字融合了全文语义信息后的增强向量表示。因此，Multi-head Self-Attention可以看作是对文本中每个字分别增强其语义向量表示的黑盒。


### Transformer Encoder
在Multi-head Self-Attention的基础上再添加一些“佐料”，就构成了大名鼎鼎的Transformer Encoder。实际上，Transformer模型还包含一个Decoder模块用于生成文本，但由于BERT模型中并未使用到Decoder模块，因此这里对其不作详述。下图展示了Transformer Encoder的内部结构，可以看到，Transformer Encoder在Multi-head Self-Attention之上又添加了三种关键操作：
- 残差连接（ResidualConnection）：将模块的输入与输出直接相加，作为最后的输出。这种操作背后的一个基本考虑是：修改输入比重构整个输出更容易（“锦上添花”比“雪中送炭”容易多了！）。这样一来，可以使网络更容易训练。
- Layer Normalization：对某一层神经网络节点作0均值1方差的标准化。
- 线性转换：对每个字的增强语义向量再做两次线性变换，以增强整个模型的表达能力。这里，变换后的向量与原向量保持长度相同。
![](https://cdn.jsdelivr.net/gh/szj2ys/cdn/resources/transformer_encoder.png)


可以看到，Transformer Encoder的输入和输出在形式上还是完全相同，因此，Transformer Encoder同样可以表示为将输入文本中各个字的语义向量转换为相同长度的增强语义向量的一个黑盒。


### BERT Model

组装好TransformerEncoder之后，再把多个Transformer Encoder一层一层地堆叠起来，BERT模型就大功告成了！
![](https://cdn.jsdelivr.net/gh/szj2ys/cdn/resources/bert.png)









## REFERENCES

- [Bert的训练数据生成和解读](https://zhuanlan.zhihu.com/p/157806409)

- [原生Bert的训练和使用总结](https://blog.csdn.net/BmwGaara/article/details/107557205?spm=1001.2101.3001.6650.5&utm_medium=distribute.pc_relevant.none-task-blog-2%7Edefault%7ECTRLIST%7ERate-5.pc_relevant_aa&depth_1-utm_source=distribute.pc_relevant.none-task-blog-2%7Edefault%7ECTRLIST%7ERate-5.pc_relevant_aa&utm_relevant_index=8)


- [神经网络权重初始化为0](https://zhuanlan.zhihu.com/p/364142934)

- [BERT你关注不到的点](https://zhuanlan.zhihu.com/p/242253766)

- [一文读懂BERT中的WordPiece](https://www.cnblogs.com/huangyc/p/10223075.html)
- [超详细BERT介绍（一）BERT主模型的结构及其组件](https://blog.csdn.net/gg7894125/article/details/106884858/)
- [BERT 详解](https://zhuanlan.zhihu.com/p/103226488)
- [BERT详解：BERT一下，你就知道](https://zhuanlan.zhihu.com/p/225180249?utm_source=wechat_session)
- [一文读懂BERT(原理篇)](https://blog.csdn.net/jiaowoshouzi/article/details/89073944)
- [BERT详解--慢慢来](https://www.cnblogs.com/kouin/p/13427243.html)
- [谷歌BERT模型深度解析](https://www.jiqizhixin.com/articles/2018-12-03)
- [彻底理解 Google BERT 模型](https://baijiahao.baidu.com/s?id=1651912822853865814&wfr=spider&for=pc)
- [BERT模型详解](http://fancyerii.github.io/2019/03/09/bert-theory/)
- [图解BERT模型：从零开始构建BERT](https://cloud.tencent.com/developer/article/1389555)



