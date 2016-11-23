// 引入模块
var express = require('express');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');



// 启动服务
var router = require('./router');
var app = express();
app.listen(8000);



// 服务配置及中间件
app.set('views',path.join(__dirname,'views')); //模板位置
app.set('view engine','jade'); // 模板引擎
app.use(express.static(path.join(__dirname,'sources'))); //资源位置
app.use(favicon(path.join(__dirname, '/sources/favicon.ico'))); // 网站图标
// 之前版本的用法是app.use(bodyParser())
app.use(bodyParser.json()); // 解析json请求
app.use(bodyParser.urlencoded({extended: false})); // 解析form表单
app.use(cookieParser()); // 4.XX 版本后脱离Express需单独安装
/** 
**  4.XX 版本后脱离Express需单独安装且依赖cookieParser,opts中加密所需的secret必须设置
**  此session存在内存中，可通过配置使其存放在数据库中
**/
app.use(session({secret: 'vecchio', resave: false, saveUninitialized: true}));

// 单独路由login/logout，其余路由进行session检测
app.use('/login', require('./routes/login'));
app.use('/logout', require('./routes/logout'));
// 构造一个中间件，进行session权限检测
app.use(function(req, res, next){
    if(req.session.person === undefined){
        res.redirect('/login');
    }else{
        next();
    }
});
router(app); // 路由,要放在bodyParser等中间件后面



// 以下为错误处理 todo 单独封装
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});