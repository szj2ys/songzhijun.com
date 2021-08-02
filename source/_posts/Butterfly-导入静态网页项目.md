---
title: Butterfly导入静态网页项目
comments: false
tags:
  - 教程
  - Hexo
  - 主题
  - butterfly
categories: Butterfly进阶教程
keywords: 'hexo,butterfly,主题,doc,教程,文档'
description: Butterfly导入静态网页项目
abbrlink: 13c1571e
date: 2021-08-02 10:29:58
top_img:
cover:
---

- 首先使用 hexo new page “新创建的文章名称”

- 然后删除该文章文件夹下的 index.md

- 把静态项目文件复制到文章目录下

- 在博客根目录配置文件 _config.yml 中作如下配置

```javascripts
skip_render:
  - 新创建的文章名称/*
  - 新创建的文章名称/**
```

例子：

- 新建文章

```shell
hexo new page "AosWebsite"
```

- 删除 index.md 把静态项目导入

![](https://cdn.jsdelivr.net/gh/Y-JINHAO/resources/img/QQ%E6%88%AA%E5%9B%BE20210508211445.png)

- 在 _config.yml 中 skip_render 下配置匹配路径

```javascripts
skip_render:
  - AosWebsite/*
  - AosWebsite/**
```

- 接下来即可访问路径: 博客部署的网址/AosWebsite/

