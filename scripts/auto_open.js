var exec = require('child_process').exec;
// Hexo 2.x 用户复制这段
// hexo.on('new', function(path){
//    exec('open -a "Typora编辑器绝对路径.app" ' + path);
//});
// Hexo 3 用户复制这段
hexo.on('new', function(data){
    exec('open -a "/Applications/MWeb.app" ' + data.path);
});

