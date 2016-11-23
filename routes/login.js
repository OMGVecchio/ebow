var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/examBaseOnWeb');

router.get('/', function(req, res){
	var person = req.session.person;
	var data = req.query.data || 'ok';
	if(person === undefined){
		res.render('login', {
			title: '大学计算机基础在线考试系统',
			data: data
		});
	}else{
		if(person.type === 0){
			res.redirect('/admin/student-admin');
		}else if(person.type ===1){
			res.redirect('/teacher/info');
		}else if(person.type ===2){
			res.redirect('/student/info');
		}
	}
});
router.post('/check', function(req, res){
	var id = parseInt(req.body.account, 10);
	var pw = req.body.password;
	var data = '';
	var adminModel = require('../db/users/admin');
	adminModel.findOne({_id: id}, function(error, admin){
		if(admin){
			if(admin.password === pw){
				req.session.person = admin;
				res.redirect('/admin/student-admin');
			}else{
				res.redirect('/login?data=password-error');
			}
		}else{
			var teacherModel = require('../db/users/teacher');
			teacherModel.findOne({_id: id}, function(error, teacher){
				if(teacher){
					if(teacher.password === pw){
						req.session.person = teacher;
						res.redirect('/teacher/info');
					}else{
						res.redirect('/login?data=password-error');
					}
				}else{
					var studentModel = require('../db/users/student');
					studentModel.findOne({_id: id}, function(error, student){
						if(student){
							if(student.password === pw){
								req.session.person = student;
								res.redirect('/student/info');
							}else{
								res.redirect('/login?data=password-error');
							}
						}else{
							res.redirect('/login?data=account-error');
						}
					});
				}
			});
		}
	});
});

module.exports = router;