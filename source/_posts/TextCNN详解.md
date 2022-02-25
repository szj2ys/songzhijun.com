---
title: TextCNN详解
tags:
  - TextCNN
keywords: 'TextCNN'
cover: 'https://img1.baidu.com/it/u=2268867597,1321565778&fm=253'
comments: true
abbrlink: 6bc1f905
date: 2022-02-07 15:28:45
updated: 2022-02-07 15:28:45
categories:
description:
top_img:
---

## 什么是卷积？

最好理解的方式就是，一个小框在矩阵上滑动，并通过一定的计算来得到一个新的矩阵。看图吧，这样更好理解！

![](https://cdn.jsdelivr.net/gh/szj2ys/cdn/resources/convolution.gif)

卷积神经网络的核心思想是捕捉局部特征，对于文本来说，局部特征就是由若干单词组成的滑动窗口，类似于N-gram。卷积神经网络的优势在于能够自动地对N-gram特征进行组合和筛选，获得不同抽象层次的语义信息。


## TextCNN原理
Yoon Kim在论文(2014 EMNLP) [Convolutional Neural Networks for Sentence Classification](https://link.zhihu.com/?target=https%3A//pan.baidu.com/disk/pdfview%3Fpath%3D%252Fpaper%252Fnlp%252FConvolutional%2520Neural%2520Networks%2520for%2520Sentence%2520Classification.pdf)提出TextCNN。将卷积神经网络CNN应用到文本分类任务，利用多个不同size的kernel来提取句子中的关键信息（类似于多窗口大小的ngram），从而能够更好地捕捉局部相关性。

每一个单词的embedding固定，所以kernel size的宽度不变，只能改变高度。kernel的通道可以理解为用不同的词向量表示。

输入句子的长度不一样，但卷积核的个数一样。每个卷积核抽取单词的个数不一样，高度低的形成feature maps长度就较长，高度高的形成feature maps的长度就较短，但feature maps的长度不影响后面的输入，因为通过Max-over-time pooling层后，每一个feature maps都只取一个最大值，所以最终形成的向量与卷积核的个数一致。

![](https://cdn.jsdelivr.net/gh/szj2ys/cdn/resources/textcnn2.png)

## TextCNN模型结构
TextCNN只能输入文本上纵向滑动，因为每个单词的embedding长度固定，不能截断。Filter的宽度要与输入向量一致，不同的Filter高度不一样。

![](https://cdn.jsdelivr.net/gh/szj2ys/cdn/resources/textcnn.png)

TextCNN与image-CNN的差别： 
- 最大的不同便是在输入数据的不同； 
- 图像是二维数据, 图像的卷积核是从左到右, 从上到下进行滑动来进行特征抽取；自然语言是一维数据, 虽然经过word-embedding 生成了二维向量，但是对词向量只能做从上到下，做从左到右滑动来进行卷积没有意义； 
- 文本卷积宽度的固定的，宽度的就embedding的维度。文本中卷积核的设计和图像中的不同。
- 在文本分类中，主要是要注意一下和CV场景中不同的情况，卷积核不是一个正方形，是一个宽和word embedding相同、长表示n-gram的窗口。一个卷积层会使用多个不同大小的卷积核，往往是(3, 4, 5)这种类型。每一种大小的卷积核也会使用很多个。



## TextCNN训练详细过程
### 总体流程
![](https://cdn.jsdelivr.net/gh/szj2ys/cdn/resources/textcnn1.png)

- Embedding：第一层是图中最左边的7乘5的句子矩阵，每行是词向量，维度=5，这个可以类比为图像中的原始像素点。
 - Convolution：然后经过 kernel_sizes=(2,3,4) 的一维卷积层，每个kernel_size 有两个输出 channel。我们也可以有多个不同的卷积核，分别代表不同特征的提取，它们的维度也可以不同，分别代表unigram, bigram，trigram, 4-gram等的提取。
-  MaxPolling：第三层是一个1-max pooling层，这样不同长度句子经过pooling层之后都能变成定长的表示。
-  FullConnection and Softmax：最后接一层全连接的 softmax 层，输出每个类别的概率。
  


通道： 
- 图像中可以利用 (R, G, B) 作为不同channel； 
- 文本的输入的channel通常是不同方式的embedding方式（比如 word2vec或Glove），实践中也有利用静态词向量和fine-tunning词向量作为不同channel的做法。


一维卷积（conv-1d）： 
- 图像是二维数据； 
- 文本是一维数据，因此在TextCNN卷积用的是一维卷积（在word-level上是一维卷积；虽然文本经过词向量表达后是二维数据，但是在embedding-level上的二维卷积没有意义）。一维卷积带来的问题是需要通过设计不同 kernel_size 的 filter 获取不同宽度的视野。


### Embedding层
![](https://cdn.jsdelivr.net/gh/szj2ys/cdn/resources/textcnn2.png)

上图的输入是一个用预训练好的词向量（Word2Vector或者glove）方法得到的一个Embedding层。每一个词向量都是通过无监督的方法训练得到的。

词向量的维度是固定的，相对于原来的One-Hot编码要小，同时在新的词向量空间语义上相近或者语法相近的单词会更加接近。

所以你可以看到这里的词向量有wait、for、the等，把这些词向量拼接起来就得到一个Embedding layer。两个维度，0轴是单词、1轴是词向量的维度（固定的）。当然实际的Embedding layer维度要比这里图像表示的大的多。至于细节，看后面代码。



到此，我们已经得到了一张二维的图（矩阵）了，利用我们用CNN处理图像的思想，后面就可以用卷积池化那一套CNN的套路来搞定了，实际上也确实这样，但是这里还有有些区别的，下面我们就看看有哪些不一样的地方。

### 卷积(convolution)
相比于一般CNN中的卷积核，这里的卷积核的宽度一般需要个词向量的维度一样，图上的维度是6 。卷积核的高度则是一个超参数可以设置，比如设置为2、3等如图。然后剩下的就是正常的卷积过程了。

### 池化(pooling)
这里的池化操作是max-overtime-pooling，其实就是在对应的feature map求一个最大值。最后把得到的值做concate。

#### 添加池化层的作用：

- 降维。这点很好理解，就是经过池化操作后，图像"变小"了。在图像处理中，把图像缩小就称为下采样或降采样，由此可窥见池化操作的降维性质。
- 不变性(invariance)。包括平移不变性(translation invariance)，旋转不变性(rotation invariance)，尺度不变性(scale invariance)。简单来说，池化操作能将卷积后得到的特征图中的特征进行统一化。另外，平移不变性，是指一个特征，无论出现在图片的哪一个位置，都会识别出来（也有人说平移不变性是权值共享带来的？）。
- 定长输出。比如我们的文本分类的例子中就是使用到了这个特性。无论经过卷积后得到的特征图有多大，使用池化操作后总能得到一个scalar，再将这些scalar拼接在一起，就能得到一个定长的向量；
- 参数减少, 进一步加速计算；
- 降低了过拟合的风险；

### 优化、正则化
池化层后面加上全连接层和SoftMax层做分类任务，同时防止过拟合，一般会添加L2和Dropout正则化方法。最后整体使用梯度法进行参数的更新模型的优化。


## 基于pytorch实现TextCNN模型


```python
class Config(object):

    """配置参数"""
    def __init__(self, dataset):
    
        # Bert的输出词向量的维度
        self.hidden_size = 768
        # 卷积核尺寸
        self.filter_sizes = (2,3,4)
        # 卷积核数量
        self.num_filters = 256
        # droptout
        self.dropout = 0.5
class Model(nn.Module):
    def __init__(self, config):
        super(Model, self).__init__()
        self.bert = BertModel.from_pretrained(config.bert_path)
        for param in self.bert.parameters():
            param.requires_grad = True

        self.convs = nn.ModuleList(
             [nn.Conv2d(in_channels=1, out_channels=config.num_filters, kernel_size=(k, config.hidden_size)) for k in config.filter_sizes]
        )

        self.droptout = nn.Dropout(config.dropout)

        self.fc = nn.Linear(config.num_filters * len(config.filter_sizes), config.num_classes)

    def conv_and_pool(self, x, conv):
        x = conv(x)#  最后一个维度为1   ：(input_height-kenl_size+padding*2)/stride[0]
        x = F.relu(x)
        x = x.squeeze(3)#去掉最后一个维度
        size = x.size(2)
        x = F.max_pool1d(x, size)
        x = x.squeeze(2)
        return x

    def forward(self, x):
        # x [ids, seq_len, mask]
        context = x[0] #对应输入的句子 shape[128,32]
        mask = x[2] #对padding部分进行mask shape[128,32]
        encoder_out, pooled = self.bert(context, attention_mask = mask, output_all_encoded_layers = False) 
        out = encoder_out.unsqueeze(1) #输入卷积需要四维的数据
        out = torch.cat([self.conv_and_pool(out, conv)for conv in self.convs], 1)
        out = self.droptout(out)
        out = self.fc(out)
        return out
```






## REFERENCES 
- [文本分类算法TextCNN原理详解](https://www.cnblogs.com/ModifyRong/p/11319301.html)
- [意图识别:TextCNN的优化经验Tricks汇总](https://www.cnblogs.com/ModifyRong/p/11442661.html)
- [TextCNN 代码详解](https://www.cnblogs.com/ModifyRong/p/11442595.html)
- [自然语言中的CNN--TextCNN（基础篇）](https://zhuanlan.zhihu.com/p/40276005)
- [TextCNN原理解析与代码实现](https://juejin.cn/post/6844904185608011789)
- [深入TextCNN（一）详述CNN及TextCNN原理](https://zhuanlan.zhihu.com/p/77634533)
- [卷积神经网络（CNN）入门讲解](https://zhuanlan.zhihu.com/p/77634533)
- [CS224N笔记(十一):NLP中的CNN](https://zhuanlan.zhihu.com/p/68333187)
- [在NLP中理解CNN](https://zhuanlan.zhihu.com/p/46531725)












