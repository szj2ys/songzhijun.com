---
title: git push时403，解决思路与方法
comments: true
date: 2021-08-01 14:19:06
tags:
  - 问题解决
  - Github
categories: GitHub
keywords: 'GitHub,问题解决'
description: GitHub用户验证新规导致push时403，解决思路与方法
top_img:
abbrlink: 198a4223a
cover: https://img1.baidu.com/it/u=2990055448,1579759864&fm=26&fmt=auto&gp=0.jpg
sticky: 90
---



用命令行`git push`代码的时候突然出现了这样的报错：
```shell
remote: Password authentication is temporarily disabled as part of a brownout. Please use a personal access token instead.
remote: Please see https://github.blog/2020-07-30-token-authentication-requirements-for-api-and-git-operations/ for more information.
fatal: unable to access 'https://github.com/szj2ys/funlp.git/': The requested URL returned error: 403
```

反复试了多次，检查网络是正常的，奇怪的是前几分钟我还成功向远程push过代码，怎么突然就不行了呢？

哪里出问题，就从哪里找原因，报错信息通常会给我们指出错误原因和解决途径。那我们就看下报错信息，已经告诉我们从哪里
着手，就是这个[网址](https://github.blog/2020-07-30-token-authentication-requirements-for-api-and-git-operations/)
`https://github.blog/2020-07-30-token-authentication-requirements-for-api-and-git-operations/`

原来是因为安全考虑，从2021年中开始，GitHub对使用`REST API`进行身份验证时将不再支持帐户密码，并要求对GitHub上所有经过身份验证的`API`操作使用基于`Token`的身份验证（例如，个人访问、 OAuth 或 GitHub App)。
这样做的好处: 
- Token是特定于 GitHub 的，可以根据每次使用或每个设备生成
- 可以在任何时候单独撤销，而不需要更新凭据
- 可以限制范围，只允许用例授权范围内的访问
- 防止密码泄露

既然原因找到了，那要怎么解决呢？
既然是由密码验证转换到Token验证，那就首先要搞一个Token，GitHub给了生成Token的[教程](https://help.github.com/en/github/authenticating-to-github/creating-a-personal-access-token-for-the-command-line)。照着教程一步步来就可以了。
获取到Token后，就要把Token放到正确的地方，放在哪呢？我也不知道，但是GitHub给出了提示，你可以通过[这篇教程](https://docs.github.com/en/github/getting-started-with-github/updating-credentials-from-the-macos-keychain)把密码替换成Token。
好了，问题到这基本上就解决了。但是GitHub提示如果不想每次都手动认证一遍，你就需要设置缓存，教程在[这里](https://docs.github.com/en/github/getting-started-with-github/caching-your-github-credentials-in-git)。

最后，再`git push`推送远程试下，发现顺利提交了，完美~

