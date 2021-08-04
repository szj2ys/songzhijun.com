#/bin/bash

## 第一次先执行下面命令安装一些包
# npm install hexo-deployer-git --save
# npm install hexo-generator-search --save
gulp  # 压缩HTML
hexo clean
hexo generate

hexo server # 本地预览
hexo deploy  # 部署到Git上

git add .
git commit -m 'xx'
git push

# hexo new "文章题目"  # 创建新文章
# hexo new page "页面名称"  # 创建新页面






# # 快捷命令
# hexo g == hexo generate
# hexo d == hexo deploy
# hexo s == hexo server
# hexo n == hexo new


