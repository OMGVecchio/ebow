var admin   = require('./routes/admin');
var student = require('./routes/student');
var teacher = require('./routes/teacher');

/**
***渲染参数:
***		userType:0,学生;1,老师;2,管理员[决定路由大方向]
***		pageItem:代表当前路由下的第几个tab被选中[决定具体的路由地址]
**/
module.exports = function(app){
	// 对登录的用户做限制，禁止访问非本身份的模块
	app.use('/student', function(req, res, next){
		if(req.session.person.type !== 2){
			res.redirect('/forbidden');
		}
		next();
	});
	app.use('/teacher', function(req, res, next){
		if(req.session.person.type !== 1){
			res.redirect('/forbidden');
		}
		next();
	});
	app.use('/admin', function(req, res, next){
		if(req.session.person.type !== 0){
			res.redirect('/forbidden');
		}
		next();
	});
	app.use('/student', student);
	app.use('/teacher', teacher);
	app.use('/admin',   admin  );

	// 页面提示:禁止访问
	app.get('/forbidden', function(req, res){
		res.render('forbidden');
	});
};