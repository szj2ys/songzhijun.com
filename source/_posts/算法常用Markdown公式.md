---
title: 算法常用Markdown公式
tags:
  - 公式
keywords: 公式
comments: true
abbrlink: e20a06a0
date: 2022-01-25 16:53:48
updated: 2022-01-25 16:53:48
categories:
description: ''
top_img:
cover:
---
{% raw %}

查准率
$$Precision(\%) = \frac{True positive}{(True positive+False positive)} \times 100$$


查全率
$$Recall(\%) = \frac{True positive}{(True positive+False negative)} \times 100$$

F1-score
$$F1-Score = \frac{2}{\frac{1}{p}+\frac{1}{r}}$$

错误率
$$Error = \frac{1}{m_{dev}}\sum_{i=1}^{m_{dev}}L\{{\hat y^{(i)} \neq y^{(i)}}\}$$

softmax
$$softmax(x)_i = \frac {e^{x_i}}{\sum _j e^{x_j}}$$

sigmoid
$$\sigma(x) = \frac{1}{1+e^{-x}}$$

贝叶斯
$$Pr(B|A)=\frac {Pr(A|B)·Pr(B)}{Pr(A)}=\frac {Pr(A\cap B)}{Pr(A)}$$

tanh(z)函数
$$\frac {e^z-e^{-z}}{e^z+e^{-z}}$$

softmax函数（归一化指数函数）
$$
softmax(X_{m * n})=
\left [ 
\begin {matrix}
\frac {e^{x_{11}}}{\sum_{i=1}^{n} e^{x_{1 i}}} & \frac {e^{x_{12}}}{\sum_{i=1}^{n} e^{x_{1 i}}} & ... & \frac {e^{x_{1n}}}{\sum_{i=1}^{n} e^{x_{1 i}}} 
\\
\frac {e^{x_{2 1}}}{\sum_{i=1}^{n} e^{x_{2 i}}} & \frac {e^{x_{2 2}}}{\sum_{i=1}^{n} e^{x_{2 i}}} & ... & \frac {e^{x_{2 n}}}{\sum_{i=1}^{n} e^{x_{2 i}}}
\\
\vdots & \vdots & \ddots & \vdots
\\ 
\frac {e^{x_{m 1}}}{\sum_{i=1}^{n} e^{x_{m i}}} & \frac {e^{x_{m 2}}}{\sum_{i=1}^{n} e^{x_{m i}}} 
& ... & \frac {e^{x_{m n}}}{\sum_{i=1}^{n} e^{x_{m i}}}
\end {matrix} 
\right ]
$$

{% endraw %}
