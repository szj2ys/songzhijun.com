## songzhijun.com


#第一个账号，默认使用的账号，不用做任何更改
Host szj2ys.github.com
    HostName github.com
    User git
    IdentityFile ~/.ssh/szj2ys_rsa
#第二个新账号，#"xxxxxx"为前缀名，可以任意设置，要记住，后面需要用到
Host iszj.github.com
    HostName github.com
    User git
    IdentityFile ~/.ssh/iszj_rsa


這是 我的个人博客网站 hexo 主題 Butterfly 的文件/ Demo 倉庫

使用教程

```shell
# 第一步
git clone https://github.com/jerryc127/butterfly.js.org.git

# 第二步
把clone下来的内容粘贴到你的项目内

# 第三步，安装依赖
npm install

```


### 提交文章到 `Butterfly 美化/優化/魔改 教程合集`

1. 確保你的文章跟 Butterfly 主題有關
2. 點擊這個[鏈接](https://github.com/jerryc127/butterfly.js.org/edit/main/source/_posts/butterfly-collection.md)
3. 按要求新增 作者 + 文章連結
  ```markdown
    | Jerry | [教程a](https://butterfly.js.org)
  ```
4. 點擊下面的 `Commit changes` ，合併到 butterfly.js.org 倉庫

### 提交網站到 `示例`

1. 確保你使用 Butterfly 主題
2. 點擊這個[鏈接](https://github.com/jerryc127/butterfly.js.org/edit/main/source/_data/link.yml)
3. 按要求新增內容
  ```yaml
    - name: 博客名
      link: 博客地址
      avatar: 博客頭像
      descr: 博客描述
  ```
4. 點擊下面的 `Commit changes` ，合併到 butterfly.js.org 倉庫