---
title: Transformer详解
tags:
  - Transformer
keywords: Transformer、预训练模型
comments: true
top_img: 
abbrlink: c2ac91e1
date: 2022-01-24 20:40:46
updated: 2022-01-24 20:40:46
categories:
description:
cover: https://img1.baidu.com/it/u=2878985419,3213940956&fm=253
sticky: 99
---



![](https://cdn.jsdelivr.net/gh/szj2ys/cdn/resources/transformer.jpg)

左边处理源语言，称之为Encoder，右边处理目标语言，被称为Decoder，分别由N个Block组成。然后每个block都有这么几个模块：

- Multi-Head Attention
- Masked Multi-Head Attention
- Add & Norm
- Feed Forward
- Positional Encoding
- Linear

其中， Feed Forward和Linear是神经网络的基本操作全连接层，Add & Norm以及延伸出来的一条侧边也是一个常见的神经网络结构残差连接


## Attention

attention说白了就是权重计算和加权求和。图上的循环神经网络中的每一步都会输出一个向量，在预测目标语言到某一步时，用当前步的向量去和源语言中的每一步的向量去做内积，然后经过softmax得到归一化后的权重，再用权重去把源语言上的每一步的向量去做加权平均。然后做预测的时候也作为输入进入全连接层

### Multi-Head Attention

![](https://cdn.jsdelivr.net/gh/szj2ys/cdn/resources/transformer_multihead_attention.jpg)

Multi-Head Attention是由多个Scaled Dot-Product Attention的函数组合而成的。
Scaled Dot-Product Attention的计算公式如下：

<!--![](https://img-blog.csdnimg.cn/20200829000047826.png#pic_center)-->
$$Attention(Q,K,V)=softmax(\frac {QK^{T}}{\sqrt{d_k}})V$$

Q、K、V的维度均为`[batch_size, seq_len, emb_dim]`

### 为什么要除以$\sqrt{d_k}$


首先计算q和k的点乘，然后除以 $\sqrt{d_k}$，经过softmax得到V上的权重分布，最后通过点乘计算V的加权值。这里$d_k$是K的维度，除以$\sqrt{d_k}$的原因是Q与K的转置相乘了，值会变大

首先我们看下原论文的解释：We suspect that for large values of dk, the dot products grow large in magnitude, pushing the softmax function into regions where it has extremely small gradients . To counteract this effect, we scale the dot products by $\frac{1}{\sqrt{d_k}}$

原文说，他们怀疑当key的维度过大的时候去做点乘值会变得很大，导致softmax函数的梯度异常的小，导致于无法快速更新参数。

我们也可以直观的来讲：

假设我们输入一个token长度为2的句子，key的维度为4，然后我们现在有query和key的在两个位置的点积，假设两个点积为`[4,9]`，我们softmax可以得到`[0.0067, 0.9933]`

```python
a = torch.tensor([4,9],dtype=torch.float64)
a.softmax(-1)
output；tensor([0.0067, 0.9933], dtype=torch.float64)
```
softmax后权重直接是99%了，如果我们除4后[1,2.25]，权重变成`[0.2227, 0.7773]`
```python
a = torch.tensor([1,2.25],dtype=torch.float64)
a.softmax(-1)
output；tensor([0.2227, 0.7773], dtype=torch.float64)
```
这样的话attention就不会只关注一个词汇，而是可以看到整句话的面貌分布。

### 对Q、K、V的理解

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

### 全连接层的作用

全连接层不仅可以变换维度，更重要的是如果没有全连接层，他们模型只会有self-attention层出来的一些线性组合，表达能力有限，而全连接层可以自己学习复杂的特征表达，并且激活函数能提供非线性。

## Encoder和Decoder

问：Encoder和Decoder是怎么联系的呢？ 

答：Decoder的每一个block比Encoder的block多一个Multi-Head Attention，这个的输入的K,V是Encoder这边的输出，由此，构建了Encoder和Decoder之间的信息传递。








![](https://pic4.zhimg.com/v2-8a9556f27d87e89a54de402744d1fcbf_r.jpg)

## Transformer 的结构
Transformer 本身是一个典型的 encoder-decoder 模型

### 模型结构总览
![](https://cdn.jsdelivr.net/gh/szj2ys/cdn/resources/transformer_model.jpg)

#### Encoder端
Encoder 端由 N(原论文中「N=6」)个相同的大模块堆叠而成，其中每个大模块又由「两个子模块」构成，这两个子模块分别为多头 self-attention 模块，以及一个前馈神经网络模块；
> 需要注意的是，Encoder 端每个大模块接收的输入是不一样的，第一个大模块(最底下的那个)接收的输入是输入序列的 embedding(embedding 可以通过 word2vec 预训练得来)，其余大模块接收的是其前一个大模块的输出，最后一个模块的输出作为整个 Encoder 端的输出。

#### Decoder 端
Decoder 端同样由 N(原论文中「N=6」)个相同的大模块堆叠而成，其中每个大模块则由「三个子模块」构成，这三个子模块分别为多头 self-attention 模块，「多头 Encoder-Decoder attention 交互模块」，以及一个前馈神经网络模块；

> - 同样需要注意的是，Decoder端每个大模块接收的输入也是不一样的，其中第一个大模块(最底下的那个)训练时和测试时的接收的输入是不一样的，并且每次训练时接收的输入也可能是不一样的(也就是模型总览图示中的"shifted right"，后续会解释)，其余大模块接收的是同样是其前一个大模块的输出，最后一个模块的输出作为整个Decoder端的输出
> - 对于第一个大模块，简而言之，其训练及测试时接收的输入为：
>   - 训练的时候每次的输入为上次的输入加上输入序列向后移一位的 ground truth(例如每向后移一位就是一个新的单词，那么则加上其对应的 embedding)，特别地，当 decoder 的 time step 为 1 时(也就是第一次接收输入)，其输入为一个特殊的 token，可能是目标序列开始的 token(如)，也可能是源序列结尾的 token(如)，也可能是其它视任务而定的输入等等，不同源码中可能有微小的差异，其目标则是预测下一个位置的单词(token)是什么，对应到 time step 为 1 时，则是预测目标序列的第一个单词(token)是什么，以此类推；
>       - 这里需要注意的是，在实际实现中可能不会这样每次动态的输入，而是一次性把目标序列的embedding通通输入第一个大模块中，然后在多头attention模块对序列进行mask即可
>   - 而在测试的时候，是先生成第一个位置的输出，然后有了这个之后，第二次预测时，再将其加入输入序列，以此类推直至预测结束。


### Encoder 端各个子模块
所有的编码器在结构上都是相同的，但它们没有共享参数。每个解码器都可以分解成两个子层。
![](https://cdn.jsdelivr.net/gh/szj2ys/cdn/resources/encoder.png)


#### 多头 self-attention 模块
在介绍Encoder模块之前，先介绍 self-attention 模块，图示如下：
![](https://cdn.jsdelivr.net/gh/szj2ys/cdn/resources/self_attention.png)

上述 attention 可以被描述为「将 query 和 key-value 键值对的一组集合映射到输出」，其中 query，keys，values 和输出都是向量，其中 query 和 keys 的维度均为$d_k$，values 的维度为$d_v$(论文中$d_k=d_v=d_{model}/h=64$)，输出被计算为 values 的加权和，其中分配给每个 value 的权重由 query 与对应 key 的相似性函数计算得来。这种 attention 的形式被称为“Scaled Dot-Product Attention”，对应到公式的形式为：

$$Attention(Q,K,V)=softmax(\frac {QK^{T}}{\sqrt{d_k}})V$$

而多头 self-attention 模块，则是将$Q、K、V$通过参数矩阵映射后(给$Q、K、V$分别接一个全连接层)，然后再做 self-attention，将这个过程重复$h$(原论文中$h=8$)次，最后再将所有的结果拼接起来，再送入一个全连接层即可，图示如下：

![](https://cdn.jsdelivr.net/gh/szj2ys/cdn/resources/multi_head_attention.png)
对应到公式的形式为：

$$MultiHead(Q,K,V)=Concat(head_1,head_2,\ldots,head_h)W^O$$

$$where \ head_i = Attention(QW_i^Q,KW_i^K,VW_i^V)$$

其中$W_i^Q \in \mathbb{R}^{d_{model} \times d_k}，W_i^K \in \mathbb{R}^{d_{model} \times d_k}，W_i^V \in \mathbb{R}^{d_{model} \times d_v}，W_i^O \in \mathbb{R}^{hd_{v} \times d_{model}}，$

#### 前馈神经网络模块

前馈神经网络模块(即图示中的 Feed Forward)由两个线性变换组成，中间有一个 ReLU 激活函数，对应到公式的形式为：



$$FFN(x)=max(0,xW_1 + b_1)W_2 + b_2$$

论文中前馈神经网络模块输入和输出的维度均为$d_{model}=512$，其内层的维度$d_{ff}=2048$



### Decoder 端各个子模块


#### 多头 self-attention 模块
Decoder 端多头 self-attention 模块与 Encoder 端的一致，但是**需要注意的是 Decoder 端的多头 self-attention 需要做 mask，因为它在预测时，是“看不到未来的序列的”，所以要将当前预测的单词(token)及其之后的单词(token)全部 mask 掉。**

#### 多头 Encoder-Decoder attention 交互模块

多头 Encoder-Decoder attention 交互模块的形式与多头 self-attention 模块一致，唯一不同的是其$Q,K,V$矩阵的来源，其$Q$矩阵来源于下面子模块的输出(对应到图中即为 masked 多头 self-attention 模块经过 Add & Norm 后的输出)，而$K,V$矩阵则来源于整个 Encoder 端的输出，仔细想想其实可以发现，这里的交互模块就跟 seq2seq with attention 中的机制一样，目的就在于让 Decoder 端的单词(token)给予 Encoder 端对应的单词(token)“更多的关注(attention weight)”

#### 前馈神经网络模块
该部分与 Encoder 端的一致


### 其他模块

#### Add & Norm 模块
Add & Norm 模块接在 Encoder 端和 Decoder 端每个子模块的后面，其中 Add 表示残差连接，Norm 表示 LayerNorm，残差连接来源于论文Deep Residual Learning for Image Recognition[1]，LayerNorm 来源于论文Layer Normalization[2]，因此 Encoder 端和 Decoder 端每个子模块实际的输出为：$LayerNorm(x + Sublayer(x))$，其中$Sublayer(x)$为子模块的输出。

#### Positional Encoding
Positional Encoding 添加到 Encoder 端和 Decoder 端最底部的输入 embedding。Positional Encoding 具有与 embedding 相同的维度$d_{model}$
具体做法是使用不同频率的正弦和余弦函数，公式如下：
- $PE(pos,2i)=sin(pos/10000^{2i/d_{model}})$
- $PE(pos,2i+1)=cos(pos/10000^{2i/d_{model}})$

其中$pos$为位置，$i$为维度，之所以选择这个函数，是因为任意位置$PE_{pos + k}$可以表示为$PE_{pos}$的线性函数，这个主要是三角函数的特性：

$$sin(α  + \beta) = sin(α)cos(\beta) + cos(α)sin(\beta)$$

$$cos(α  + \beta) = cos(α)cos(\beta) - sin(α)sin(\beta)$$

需要注意的是，Transformer 中的 Positional Encoding 不是通过网络学习得来的，而是直接通过上述公式计算而来的，论文中也实验了利用网络学习 Positional Encoding，发现结果与上述基本一致，但是论文中选择了正弦和余弦函数版本，**因为三角公式不受序列长度的限制，也就是可以对比所遇到序列的更长的序列进行表示。**


## Transformer相关问题

### self-attention是什么？
self-attention，也叫 intra-attention，是一种通过自身和自身相关联的 attention 机制，从而得到一个更好的 representation 来表达自身，self-attention 可以看成一般 attention 的一种特殊情况。在 self-attention 中，$Q=K=V$，序列中的每个单词(token)和该序列中其余单词(token)进行 attention 计算。self-attention 的特点在于**无视词(token)之间的距离直接计算依赖关系，从而能够学习到序列的内部结构**，实现起来也比较简单，值得注意的是，在后续一些论文中，self-attention 可以当成一个层和 RNN，CNN 等配合使用，并且成功应用到其他 NLP 任务。

下例子可以大概探知 self-attention 的效果：
![](https://cdn.jsdelivr.net/gh/szj2ys/cdn/resources/self_attention1.png)
从图中可以看出，self-attention 可以捕获同一个句子中单词之间的一些句法特征或者语义特征。

![](https://cdn.jsdelivr.net/gh/szj2ys/cdn/resources/self_attention2.png)

很明显，引入 Self Attention 后会更容易捕获句子中长距离的相互依赖的特征，因为如果是 RNN 或者 LSTM，需要依次序序列计算，对于远距离的相互依赖的特征，要经过若干时间步步骤的信息累积才能将两者联系起来，而距离越远，有效捕获的可能性越小。

但是 Self Attention 在计算过程中会直接将句子中任意两个单词的联系通过一个计算步骤直接联系起来，所以远距离依赖特征之间的距离被极大缩短，有利于有效地利用这些特征。除此外，Self Attention 对于增加计算的并行性也有直接帮助作用。这是为何 Self Attention 逐渐被广泛使用的主要原因。

### self-attention 为什么要使用 Q、K、V，仅仅使用 Q、V/K、V 或者 V 为什么不行？

self-attention 使用 Q、K、V，这样三个参数独立，模型的表达能力和灵活性显然会比只用 Q、V 或者只用 V 要好些，当然主流 attention 的做法还有很多种，比如说 seq2seq with attention 也就只有 hidden state 来做相似性的计算，处理不同的任务，attention 的做法有细微的不同，但是主体思想还是一致的。

>其实还有个小细节，因为 self-attention 的范围是包括自身的(masked self-attention 也是一样)，因此至少是要采用 Q、V 或者 K、V 的形式，而这样“询问式”的 attention 方式，个人感觉 Q、K、V 显然合理一些。

### Transformer 为什么需要进行 Multi-head Attention？

原论文中说到进行 Multi-head Attention 的原因是将模型分为多个头，形成多个子空间，可以让模型去关注不同方面的信息，最后再将各个方面的信息综合起来。其实直观上也可以想到，如果自己设计这样的一个模型，必然也不会只做一次 attention，多次 attention 综合的结果至少能够起到增强模型的作用，也可以类比 CNN 中同时使用多个卷积核的作用，直观上讲，多头的注意力**有助于网络捕捉到更丰富的特征信息**。


### Transformer 相比于 RNN/LSTM，有什么优势？

- RNN 系列的模型，并行计算能力很差。RNN 系列的模型$T$时刻隐层状态的计算，依赖两个输入，一个是$T$时刻的句子输入单词$X_t$，另一个是$T-1$时刻的隐层状态的输出$S_{t-1}$，这是最能体现 RNN 本质特征的一点，RNN 的历史信息是通过这个信息传输渠道往后传输的。而 RNN 并行计算的问题就出在这里，因为时刻的计算依赖$T-1$时刻的隐层计算结果，而$T-1$时刻的计算依赖$T-2$时刻的隐层计算结果，如此下去就形成了所谓的序列依赖关系。

- Transformer 的特征抽取能力比 RNN 系列的模型要好。但是值得注意的是，并不是说 Transformer 就能够完全替代 RNN 系列的模型了，任何模型都有其适用范围，同样的，RNN 系列模型在很多任务上还是首选，熟悉各种模型的内部原理，知其然且知其所以然，才能遇到新任务时，快速分析这时候该用什么样的模型，该怎么做好。

### Transformer 是如何训练的？

Transformer 训练过程与 seq2seq 类似，首先 Encoder 端得到输入的 encoding 表示，并将其输入到 Decoder 端做交互式 attention，之后在 Decoder 端接收其相应的输入(见 1 中有详细分析)，经过多头 self-attention 模块之后，结合 Encoder 端的输出，再经过 FFN，得到 Decoder 端的输出之后，最后经过一个线性全连接层，就可以通过 softmax 来预测下一个单词(token)，然后根据 softmax 多分类的损失函数，将 loss 反向传播即可，所以从整体上来说，Transformer 训练过程就相当于一个有监督的多分类问题。

> 需要注意的是，**Encoder 端可以并行计算，一次性将输入序列全部 encoding 出来，但 Decoder 端不是一次性把所有单词(token)预测出来的，而是像 seq2seq 一样一个接着一个预测出来的。**
> 


### Transformer 测试阶段如何进行测试呢？

对于测试阶段，其与训练阶段唯一不同的是 Decoder 端最底层的输入。

### 为什么说 Transformer 可以代替 seq2seq？

这里用代替这个词略显不妥当，seq2seq 虽已老，但始终还是有其用武之地，seq2seq 最大的问题在于「将 Encoder 端的所有信息压缩到一个固定长度的向量中」，并将其作为 Decoder 端首个隐藏状态的输入，来预测 Decoder 端第一个单词(token)的隐藏状态。在输入序列比较长的时候，这样做显然会损失 Encoder 端的很多信息，而且这样一股脑的把该固定向量送入 Decoder 端，Decoder 端不能够关注到其想要关注的信息。

上述两点都是 seq2seq 模型的缺点，后续论文对这两点有所改进，如著名的Neural Machine Translation by Jointly Learning to Align and Translate[11]，虽然确确实实对 seq2seq 模型有了实质性的改进，但是由于主体模型仍然为 RNN(LSTM)系列的模型，因此模型的并行能力还是受限，而 transformer 不但对 seq2seq 模型这两点缺点有了实质性的改进(多头交互式 attention 模块)，而且还引入了 self-attention 模块，让源序列和目标序列首先“自关联”起来，这样的话，源序列和目标序列自身的 embedding 表示所蕴含的信息更加丰富，而且后续的 FFN 层也增强了模型的表达能力(ACL 2018 会议上有论文对 Self-Attention 和 FFN 等模块都有实验分析，见论文：How Much Attention Do You Need?A Granular Analysis of Neural Machine Translation Architectures[12])，并且 Transformer 并行计算的能力是远远超过 seq2seq 系列的模型，因此我认为这是 transformer 优于 seq2seq 模型的地方。

### self-attention 公式中的归一化有什么作用？

首先说明做归一化的原因，随着的增大，点积后的结果也随之增大，这样会将 softmax 函数推入梯度非常小的区域，使得收敛困难(可能出现梯度消失的情况)

为了说明点积变大的原因，假设$q$和$k$的分量是具有均值 0 和方差 1 的独立随机变量，那么它们的点积均值为 0，方差为$d_k$，因此为了抵消这种影响，我们将点积缩放，对于更详细的分析，参见[transformer 中的 attention 为什么 scaled?](https://www.zhihu.com/question/339723385)






## REFERENCES

- [Transformer: Attention的集大成者](https://blog.csdn.net/stdcoutzyx/article/details/108288834)
- [transformer中的attention为什么scaled?](https://www.zhihu.com/question/339723385)

- [The Illustrated Transformer](http://jalammar.github.io/illustrated-transformer/)

- [通俗理解Transformer中的Attention机制](https://blog.csdn.net/weixin_42142630/article/details/114928214?spm=1001.2101.3001.6650.1&utm_medium=distribute.pc_relevant.none-task-blog-2%7Edefault%7ECTRLIST%7ERate-1.pc_relevant_default&depth_1-utm_source=distribute.pc_relevant.none-task-blog-2%7Edefault%7ECTRLIST%7ERate-1.pc_relevant_default&utm_relevant_index=2)


- [关于bert中softmax前除以维度d的理解](https://zhuanlan.zhihu.com/p/367120088)

- [Hugging Face的BERT源码框架图文详解](https://zhuanlan.zhihu.com/p/189717114)
- [关于Transformer，面试官们都怎么问](https://mp.weixin.qq.com/s?__biz=MjM5ODkzMzMwMQ==&mid=2650412561&idx=2&sn=ef7a88ca7acfb4d666d51f1c0a7cdb7f&chksm=becd904b89ba195d9c07e5aca6fcf483cce3aee0378049d4abb977d5ce2a98095efc963151a2&mpshare=1&scene=1&srcid=0209JnIuxMtyP2L5PZN3HEfw&sharer_sharetime=1644408100818&sharer_shareid=e3facbe5e17968b425891a08c9231ad1#rd)
- [图解Transformer（完整版）](https://blog.csdn.net/longxinchen_ml/article/details/86533005)

