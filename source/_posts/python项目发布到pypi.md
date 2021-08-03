---
title: Python项目发布到pypi
tags:
  - Python
  - pypi
  - 项目发布
categories: Python教程
keywords: 'Python,Python教程,发布,pypi'
abbrlink: 6c3d97ca
date: 2021-08-01 15:03:15
description:
top_img:
cover: https://img1.baidu.com/it/u=3796794833,4230952443&fm=26&fmt=auto&gp=0.jpg
comments: true
---

首先注册pypi，并生成token

## 配置文件
在家目录下创建twine配置文件.pypirc

```shell
vi ~/.pypirc
```

填充如下内容，下面你只需要把password替换成你在pypi生成的token

```shell
[distutils]
index-servers =
  pypi

[pypi]
repository=https://upload.pypi.org/legacy/
username=__token__
password=pypi-AgEIcHlwaS5vcmcCJDJlNmNjOTRlLTg4MDgtNDQ1YS04ODIxLTI1YTg4NmI5ZDE2YxACJXsicGVybWlzc2lbbnMiOiAidXNlciIsICJ26XJzdfsdfsfdsfdsfX0AAAYgVJykZg2EBQ_QsLIQ-_ntCGdnRkFSEm3Tz_8_pIZbEgA
```

## 打包上传文件

```shell
python setup.py build
twine upload dist/*
```


