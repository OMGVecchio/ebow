var express = require('express');
var router = express.Router();

// todo 请求中添加参数，合并功能类似代码
/********** 学生管理 **********/
router.get('/student-admin', function(req, res){
	var admin = req.session.person;
	var href = '/admin/student-admin?status=ok'; // 返回的href处理地址
	var query = {}; // 查询条件
	var page = req.query.page || 1;
	var id = req.query.id || 0;
	if(id === 0){
		var name = req.query.name || 0;
		if(name !== 0){
			query.name = name;
			href = href + '&name=' + name;
		}
	}else{
		query._id = id;
		href = href + '&id=' + id;
	}
	var studentModel = require('../db/users/student');
	studentModel.count(query, function(error, count){
		studentModel.find(query, null, {skip: (page-1)*10 , limit: 10}, function(error, students){
			res.render('admin/student-admin', {
				title: '学生管理',
				userType : 2,
				pageItem: 0,
				user: admin,
				students: students,
				count: count,
				pageNumber: page,
				href: href
			});
		});
	});
});
router.post('/student-add', function(req, res){
	var studentInfo = req.body;
	var studentModel = require('../db/users/student');
	studentInfo.password = '88888888';
	var newStudent = new studentModel(studentInfo);
	newStudent.save(function(error, student){
		res.end('ok');
	});
});
router.post('/student-update', function(req, res){
	var studentInfo = req.body;
	var studentModel = require('../db/users/student');
	if(studentInfo._id == studentInfo.idOrigin){
		var updateInfo = {$set : {
			name: studentInfo.name,
			class: studentInfo.class,
			college: studentInfo.college,
			gender: studentInfo.gender,
		}};
		studentModel.update({_id: studentInfo.idOrigin}, updateInfo, function(error, student){
			res.end('ok');
		});
	}else{
		studentModel.findOne({_id: studentInfo.idOrigin}, function(error, student_1){
			var newStudent = student_1;
			newStudent._id = studentInfo._id;
			newStudent.name = studentInfo.name;
			newStudent.class = studentInfo.class;
			newStudent.college = studentInfo.college;
			newStudent.gender = studentInfo.gender;
			studentModel.remove({_id: studentInfo.idOrigin}, function(error, student_2){
				var saveStudent = new studentModel(newStudent);
				saveStudent.save(function(error, student_3){
					res.end('ok');
				});
			});
		});
	}
});
router.post('/student-del', function(req, res){
	var studentId = req.body.id;
	var studentModel = require('../db/users/student');
	studentModel.remove({_id: studentId}, function(error, student){
		res.end('ok');
	});
});
router.post('/student-reset', function(req, res){
	var studentId = req.body.id;
	var studentModel = require('../db/users/student');
	studentModel.update({_id: studentId}, {$set: {password: '88888888'}}, function(error, student){
		res.end('ok');
	});
});

/********** 教师管理 **********/
router.get('/teacher-admin', function(req, res){
	var admin = req.session.person;
	var href = '/admin/teacher-admin?status=ok'; // 返回的href处理地址
	var query = {}; // 查询条件
	var page = req.query.page || 1;
	var id = req.query.id || 0;
	if(id === 0){
		var name = req.query.name || 0;
		if(name !== 0){
			query.name = name;
			href = href + '&name=' + name;
		}
	}else{
		query._id = id;
		href = href + '&id=' + id;
	}
	var teacherModel = require('../db/users/teacher');
	teacherModel.count(query, function(error, count){
		teacherModel.find(query, null, {skip: (page-1)*10 , limit: 10}, function(error, teachers){
			res.render('admin/teacher-admin', {
				title: '教师管理',
				userType : 2,
				pageItem: 1,
				user: admin,
				teachers: teachers,
				count: count,
				pageNumber: page,
				href: href
			});
		});
	});
});
router.post('/teacher-add', function(req, res){
	var teacherInfo = req.body;
	var teacherModel = require('../db/users/teacher');
	teacherInfo.password = '88888888';
	var newTeacher = new teacherModel(teacherInfo);
	newTeacher.save(function(error, teacher){
		res.end('ok');
	});
});
router.post('/teacher-update', function(req, res){
	var teacherInfo = req.body;
	var teacherModel = require('../db/users/teacher');
	if(teacherInfo._id == teacherInfo.idOrigin){
		var updateInfo = {$set : {
			name: teacherInfo.name,
			college: teacherInfo.college,
			gender: teacherInfo.gender,
		}};
		teacherModel.update({_id: teacherInfo.idOrigin}, updateInfo, function(error, teacher){
			res.end('ok');
		});
	}else{
		teacherModel.findOne({_id: teacherInfo.idOrigin}, function(error, teacher_1){
			var newTeacher = teacher_1;
			newTeacher._id = teacherInfo._id;
			newTeacher.name = teacherInfo.name;
			newTeacher.college = teacherInfo.college;
			newTeacher.gender = teacherInfo.gender;
			teacherModel.remove({_id: teacherInfo.idOrigin}, function(error, teacher_2){
				var saveTeacher = new teacherModel(newTeacher);
				saveTeacher.save(function(error, teacher_3){
					res.end('ok');
				});
			});
		});
	}
});
router.post('/teacher-del', function(req, res){
	var teacherId = req.body.id;
	var teacherModel = require('../db/users/teacher');
	teacherModel.remove({_id: teacherId}, function(error, teacher){
		res.end('ok');
	});
});
router.post('/teacher-reset', function(req, res){
	var teacherId = req.body.id;
	var teacherModel = require('../db/users/teacher');
	teacherModel.update({_id: teacherId}, {$set: {password: '88888888'}}, function(error, teacher){
		res.end('ok');
	});
});

module.exports = router;