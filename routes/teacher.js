var express = require('express');
var router = express.Router();

/********** 个人信息管理模块 **********/
router.get('/info', function(req, res){
	var teacher = req.session.person;
	res.render('teacher/info', {
		title: '个人信息',
		userType: 1,
		pageItem: 0,
		user: teacher
	});
});

/********** 试卷管理模块 **********/
router.get('/paper-manage', function(req, res){
	var teacher = req.session.person;
	var page = req.query.page || 1;
	var href = '/teacher/paper-manage?status=ok';
	var paperModel = require('../db/paper');
	paperModel.count({teacher: teacher._id}, function(error, count){
		paperModel.find({teacher: teacher._id}, null, {skip: (page-1)*10, limit: 10}, function(error,paper){
			res.render('teacher/paper-manage', {
				title: '试卷管理',
				userType: 1,
				pageItem: 1,
				user: teacher,
				papers: paper,
				count: count,
				pageNumber: page,
				href: href
			});
		});
	});
});
// 试卷发布
router.post('/paper-publish', function(req, res){
	var publishInfo = req.body;
	var model = require('../db/exam');
	var newExam = new model({
		paper: publishInfo.paper,
		time: publishInfo.time,
		title: publishInfo.title,
		students: publishInfo.students,
		isFinished: false,
		teacher: req.session.person._id
	});
	newExam.save(function(error, exam){
		var paperModel = require('../db/paper');
		paperModel.update({_id: publishInfo.paper}, {$set: {isPublished: true}}, function(error, paper){
			res.end('ok');
		});
	});
});

/********** 考试管理模块 **********/
router.get('/exam-manage', function(req, res){
	var teacher = req.session.person;
	var examId = req.query.examId;
	var examModel = require('../db/exam');
	examModel.find({isFinished: false, teacher: teacher._id}, function(error, exams){
		// 构造"$or"查询条件,获取有资格参加本次考试的所有考生信息 todo 不存在的studentID不进行存入
		var students = null;
		var currentId = null;
		if(exams){
			if(examId){
				for(var seq in exams){
					if(exams[seq]._id == examId){
						students = exams[seq].students;
						currentId = exams[seq]._id;
					}
				}
			}else{
				if(exams[0]){
					students = exams[0].students;
					currentId = exams[0]._id;
				}
			}
		}else{
			students = [];
		}
		var queryArray = [];
		for(var index in students){
			if(index != '_schema'){
				queryArray.push({_id: students[index]});
			}
		}
		var href = '/teacher/exam-manage?status=ok&examId=' + examId;
		var page = req.query.page || 1;
		var studentModel = require('../db/users/student');
		studentModel.count(function(error, count){
			studentModel.find({$or: queryArray}, null, {skip: (page-1)*10, limit: 10}, function(error, studentAll){
				res.render('teacher/exam-manage' ,{
					title: '考试管理',
					userType: 1,
					pageItem: 2,
					user: teacher,
					exams: exams,
					students: studentAll,
					examId: currentId,
					count: count,
					pageNumber: page,
					href: href
				});
			});
		});
	});
});
// 考试完成
router.post('/exam-over', function(req, res){
	var examId = req.body.examId;
	var examModel = require('../db/exam');
	examModel.update({_id: examId}, {$set: {isFinished: true}},function(error, exam){
		res.end('ok');
	});
});
// 学生考试权限添加
router.post('/exam-permission-add', function(req, res){
	var data = req.body;
	var studentId = data.studentId;
	var examId = data.examId;
	// 添加学生权限时,在学生和考试表中做相应修改
	var examModel = require('../db/exam');
	examModel.findOne({_id: examId}, function(error, exam_1){
		if(exam_1){
			exam_1.students.push(studentId);
			examModel.update({_id: examId}, {$set: {students: exam_1.students}}, function(error, exam_2){
				var studentModel = require('../db/users/student');
				studentModel.findOne({_id: studentId}, function(error, student_2){
					student_2.exams.push(examId);
					studentModel.update({_id: studentId}, {$set: {exams: student_2.exams}}, function(error, student_2){
						res.end('ok');
					});
				});
			});
		}
	});
});
// 学生考试权限收回
router.post('/exam-permission-del', function(req, res){
	var data = req.body;
	var studentId = data.studentId;
	var examId = data.examId;
	// 删除学生权限时,在学生和考试表中做相应修改
	var examModel = require('../db/exam');
	examModel.findOne({_id: examId}, function(error, exam_1){
		var studentArray = [];
		var count = 0;
		var students = exam_1.students;
		var length = students.length;
		for(; count < length; count++){
			if(students[count] != studentId){
				studentArray.push(students[count]);
			}
		}
		examModel.update({_id: examId}, {$set: {students: studentArray}}, function(error, exam_2){
			var studentModel = require('../db/users/student');
			studentModel.findOne({_id: studentId}, function(error, student_1){
				var examArray = [];
				var count = 0;
				var exams = student_1.exams;
				var length = exams.length;
				for(; count < length; count++){
					if(exams[count] != examId){
						examArray.push(exams[count]);
					}
				}
				studentModel.update({_id: studentId}, {$set: {exams: examArray}}, function(error, student_2){
					res.end('ok');
				});
			});
		});
	});
});

/********** 试题管理模块 **********/
// 试题查询
router.get('/question-manage', function(req, res){
	// 获取query参数
	var type = req.query.type || 1;
	var id = req.query.id || 0;
	var title = req.query.title || 0;

	var href = '/teacher/question-manage?status=ok&type=' + type;
	var page = req.query.page || 1;

	var queryString = null; // 查询条件
	var model = getModel(type); // 查询的数据库模型对象
	// 选择查询的条件,若存在id则忽略title
	if(id === 0){
		if(title === 0){
			queryString = {};
		}else{
			queryString = {title: title};
			href = href + '&title=' + title;
		}
	}else{
		queryString = {_id: id};
		href = href + '&id=' + id;
	}
	model.count(queryString, function(error, count){
		model.find(queryString, null, {skip: (page-1)*10, limit: 10}, function(error, sc){
			var teacher = req.session.person;
			res.render('teacher/question-manage', {
				title: '试题管理',
				userType: 1,
				pageItem: 3,
				user: teacher,
				questions: sc,
				questionType: type,
				count: count,
				pageNumber: page,
				href: href
			});
		});
	});
});
// 试题添加
router.post('/question-add', function(req, res){
	var question = req.body;
	var type = question.type;
	var questionModel = getModel(question.type);
	var questionEntity = new questionModel(question);
	questionEntity.save(function(error, item){
		res.end('ok');
	});
});
// 试题删除
router.post('/question-del', function(req, res){
	var delData = req.body;
	var delType = delData.type;
	var delId = delData.id;
	var operateModel = getModel(delType);
	operateModel.remove({_id: delId}, function(error, question){
		res.end('ok');
	});
});
// 试题修改
router.post('/question-update', function(req, res){
	var updateData = req.body;
	var updateId = updateData.id;
	var updateType = updateData.type;
	var questionModel = getModel(updateType);
	questionModel.findById(updateId, function(error, question){
		if(updateType == '0' || updateType == '1'){
			question.a = updateData.a;
			question.b = updateData.b;
			question.c = updateData.c;
			question.d = updateData.d;
		}
		question.title = updateData.title;
		question.answer = updateData.answer;
		question.save(function(error, question){
			res.end('ok');
		});
	});
});

/********** 组卷模块 **********/
// 组卷首页
router.get('/paper-assemble', function(req, res){
	var teacher = req.session.person;
	res.render('teacher/paper-assemble', {
		title: '组卷',
		userType: 1,
		pageItem: 1,
		user: teacher
	});
});
// 组卷渲染页面
router.post('/paper-assemble', function(req, res){
	var data = {}; // 渲染模板中返回的对象
	var category_count = req.body; // 表单传递过来的对象值
	var models = []; // 数据表模型
	var querys = []; // 数据查询条件
	var counts = []; // 数据查询个数
	/**
	 * mongoose是异步操作,使用时务必小心谨慎
	 * 传来的值若为空,则对应查询值置为0[即不查询],然后在回调中进行下一张表的查询,依此类推
	 */
	for(var count = 0; count < 7; count++){
		models[count] = getModel(count.toString());
	}
	if(category_count['single-choice'] == 'on'){
		querys[0] = {};
		counts[0] = category_count['single-choice-number'];
	}else{
		querys[0] = {_id: 0};
		counts[0] = 0;
	}
	if(category_count['multiple-choice'] == 'on'){
		querys[1] = {};
		counts[1] = category_count['multiple-choice-number'];
	}else{
		querys[1] = {_id: 0};
		counts[1] = 0;
	}
	if(category_count['blank'] == 'on'){
		querys[2] = {};
		counts[2] = category_count['blank-number'];
	}else{
		querys[2] = {_id: 0};
		counts[2] = 0;
	}
	if(category_count['judgement'] == 'on'){
		querys[3] = {};
		counts[3] = category_count['judgement-number'];
	}else{
		querys[3] = {_id: 0};
		counts[3] = 0;
	}
	if(category_count['definition'] == 'on'){
		querys[4] = {};
		counts[4] = category_count['definition-number'];
	}else{
		querys[4] = {_id: 0};
		counts[4] = 0;
	}
	if(category_count['saq'] == 'on'){
		querys[5] = {};
		counts[5] = category_count['saq-number'];
	}else{
		querys[5] = {_id: 0};
		counts[5] = 0;
	}
	if(category_count['application'] == 'on'){
		querys[6] = {};
		counts[6] = category_count['application-number'];
	}else{
		querys[6] = {_id: 0};
		counts[6] = 0;
	}
	// todo 此处正是使用Promise的绝佳时机[解决callback hell]
	models[0].find(querys[0], null, {limit: counts[0]}, function(error, singleChoice){
		if(counts[0] !== 0){
			data.singleChoice = singleChoice;
		}
		models[1].find(querys[1], null, {limit: counts[1]}, function(error, multipleChoice){
			if(counts[1] !== 1){
				data.multipleChoice = multipleChoice;
			}
			models[2].find(querys[2],  null, {limit: counts[2]}, function(error, blank){
				if(counts[2] !== 2){
					data.blank = blank;
				}
				models[3].find(querys[3],  null, {limit: counts[3]}, function(error, judgement){
					if(counts[3] !== 3){
						data.judgement = judgement;
					}
					models[4].find(querys[4],  null, {limit: counts[4]}, function(error, definition){
						if(counts[4] !== 4){
							data.definition = definition;
						}
						models[5].find(querys[5],  null, {limit: counts[5]}, function(error, saq){
							if(counts[5] !== 5){
								data.saq = saq;
							}
							models[6].find(querys[6],  null, {limit: counts[6]}, function(error, application){
								if(counts[6] !== 6){
									data.application = application;
									var teacher = req.session.person;
									res.render('teacher/paper-assemble', {
										title: '组卷',
										userType: 1,
										pageItem: 1,
										user: teacher,
										data: data
									});
								}
							});
						});
					});
				});
			});
		});
	});
});
// 保存组卷
router.post('/paper-save', function(req, res){
	var questionAll = req.body;
	var title = null;
	var singleChoice = [];
	var multipleChoice = [];
	var blank = [];
	var judgement = [];
	var definition = [];
	var saq = [];
	var application = [];
	for(var index in questionAll){
		if(index == 'title'){
			title = questionAll[index];
		}else if(index.match(/single/)){
			singleChoice.push(questionAll[index]);
		}else if(index.match(/multiple/)){
			multipleChoice.push(questionAll[index]);
		}else if(index.match(/blank/)){
			blank.push(questionAll[index]);
		}else if(index.match(/judgement/)){
			judgement.push(questionAll[index]);
		}else if(index.match(/definition/)){
			definition.push(questionAll[index]);
		}else if(index.match(/saq/)){
			saq.push(questionAll[index]);
		}else if(index.match(/application/)){
			application.push(questionAll[index]);
		}
	}
	var model = require('../db/paper');
	var paper = new model({
		title: title,
		totalMark: questionAll['totalMark'],
		duration: questionAll['duration'],
		isPublished: false,
		teacher: req.session.person._id,
		singleChoice: singleChoice,
		singleChoicePoint: questionAll['sc-point'], 
		multipleChoice: multipleChoice,
		multipleChoicePoint: questionAll['mc-point'],
		blank: blank,
		blankPoint: questionAll['bl-point'],
		judgement: judgement,
		judgementPoint: questionAll['ju-point'],
		definition: definition,
		definitionPoint: questionAll['de-point'],
		saq: saq,
		saqPoint: questionAll['sa-point'],
		application: application,
		applicationPoint: questionAll['ap-point']
	});
	paper.save(function(error, paper){
		res.redirect('/teacher/paper-manage');
	});
});

// 密码修改
router.post('/password-update', function(req, res){
	var id = req.session.person._id;
	var data = req.body;
	var teacherModel = require('../db/users/teacher');
	teacherModel.findOne({_id: id}, function(error, teacher_1){
		if(data.pwOrigin == teacher_1.password){
			teacherModel.update({_id: id}, {$set: {password: data.pwNew}}, function(error, teacher_2){
				res.end('ok');
			});
		}else{
			res.end('error');
		}
	});
});

/********** 成绩管理 **********/
// 已进行完的所有考试总览
router.get('/mark-manage', function(req, res){
	var teacher = req.session.person;
	var page = req.query.page || 1;
	var href = '/teacher/mark-manage?status=ok';
	var examModel = require('../db/exam');
	examModel.count(function(error, count){
		examModel.find({isFinished: true}, null, {skip: (page-1)*10, limit: 10}, function(error, exams){
			res.render('teacher/mark-list',{
				title: '已完成考试',
				userType: 1,
				pageItem: 4,
				user: teacher,
				exams: exams,
				count: count,
				pageNumber: page,
				href: href
			});
		});
	});
});
// 进入某场具体已完成的考试,查看、修改或者给出成绩
router.get('/mark-manage/:id', function(req, res){
	var teacher = req.session.person;
	var examId = req.params.id.split(':')[1];
	var page = req.query.page || 1;
	var href = '/teacher/mark-manage/' + req.params.id + '?status=ok';
	var examModel = require('../db/exam');
	examModel.findOne({_id: examId}, function(error, exam){
		var students = null;
		if(exam){
			students = exam.students;
		}else{
			students = [];
		}
		var queryArray = [];
		for(var index in students){
			if(index != '_schema'){
				queryArray.push({_id: students[index]});
			}
		}
		var studentModel = require('../db/users/student');
		studentModel.count(function(error, count){
			studentModel.find({$or: queryArray}, null, {skip: (page-1)*10, limit: 10}, function(error, studentAll){
				var queryStudent = [];
				for(var seq in studentAll){
					queryStudent.push({studentId: studentAll[seq]._id, examId: examId});
				}
				var markModel = require('../db/mark');
				markModel.find({$or: queryStudent}, function(error, marks){
					// 查询数据库，给每位学生赋值一个分数属性
					for(var seq_1 in marks){
						var mark = marks[seq_1];
						for(var seq_2 in studentAll){
							if(studentAll[seq_2]._id == mark.studentId){
								studentAll[seq_2].mark = mark.mark;
								studentAll[seq_2].markId = mark._id;
							}
						}
					}
					res.render('teacher/mark-manage' ,{
						title: '考试管理',
						userType: 1,
						pageItem: 4,
						user: teacher,
						students: studentAll,
						count: count,
						pageNumber: page,
						href: href
					});
				});
			});
		});
	});
});
// 试卷批改
router.get('/mark-modify', function(req, res){
	var teacher = req.session.person;
	var markId = req.query.id;
	var markModel = require('../db/mark');
	markModel.findOne({_id: markId}, function(error, mark){
		var examId = mark.examId;
		var examModel = require('../db/exam');
		examModel.findOne({_id: examId}, function(error, exam){
			var paperId = exam.paper;
			var paperModel = require('../db/paper');
			paperModel.findOne({_id: paperId}, function(error, paper){
				var data = {}; // 返回的数据
				data.title = paper.title; // 试卷标题
				
				// 试卷各部分分数
				data.singleChoicePoint = paper.singleChoicePoint;
				data.multipleChoicePoint = paper.multipleChoicePoint;
				data.blankPoint = paper.blankPoint;
				data.judgementPoint = paper.judgementPoint;
				data.definitionPoint = paper.definitionPoint;
				data.saqPoint = paper.saqPoint;
				data.applicationPoint = paper.applicationPoint;
				
				var models = []; // 数据表模型

				// 数据查询条件
				var query_0 = [];
				var query_1 = [];
				var query_2 = [];
				var query_3 = [];
				var query_4 = [];
				var query_5 = [];
				var query_6 = [];

				var count = null;
				for(count = 0; count < 7; count++){
					models[count] = getModel(count.toString());
				}

				if(paper.singleChoice == []){
					query_0 = [{_id: 0}];
				}else{
					for(count = 0; count < paper.singleChoice.length; count++){
						query_0.push({_id: paper.singleChoice[count]});
					}
				}
				if(paper.multipleChoice == []){
					querys_1 = [{_id: 0}];
				}else{
					for(count = 0; count < paper.multipleChoice.length; count++){
						query_1.push({_id: paper.multipleChoice[count]});
					}
				}
				if(paper.blank == []){
					querys_2 = [{_id: 0}];
				}else{
					for(count = 0; count < paper.blank.length; count++){
						query_2.push({_id: paper.blank[count]});
					}
				}
				if(paper.judgement == []){
					querys_3 = [{_id: 0}];
				}else{
					for(count = 0; count < paper.judgement.length; count++){
						query_3.push({_id: paper.judgement[count]});
					}
				}
				if(paper.definition == []){
					querys_4 = [{_id: 0}];
				}else{
					for(count = 0; count < paper.definition.length; count++){
						query_4.push({_id: paper.definition[count]});
					}
				}
				if(paper.saq == []){
					querys_5 = [{_id: 0}];
				}else{
					for(count = 0; count < paper.saq.length; count++){
						query_5.push({_id: paper.saq[count]});
					}
				}
				if(paper.application == []){
					querys_6 = [{_id: 0}];
				}else{
					for(count = 0; count < paper.application.length; count++){
						query_6.push({_id: paper.application[count]});
					}
				}
				// todo 此处正是使用Promise的绝佳时机[解决callback hell]
				models[0].find({$or: query_0}, function(error, singleChoice){
					data.singleChoice = singleChoice;
					models[1].find({$or: query_1}, function(error, multipleChoice){
						data.multipleChoice = multipleChoice;
						models[2].find({$or: query_2}, function(error, blank){
							data.blank = blank;
							models[3].find({$or: query_3}, function(error, judgement){
								data.judgement = judgement;
								models[4].find({$or: query_4}, function(error, definition){
									data.definition = definition;
									models[5].find({$or: query_5}, function(error, saq){
										data.saq = saq;
										models[6].find({$or: query_6}, function(error, application){
											data.application = application;
											res.render('teacher/mark-modify', {
												title: '试卷批改',
												userType: 1,
												pageItem: 4,
												user: teacher,
												questions: data,
												mark: mark
											});
										});
									});
								});
							});
						});
					});
				});
			});
		});
	});
});
// 试卷成绩保存
router.post('/mark-save', function(req, res){
	var data = req.body;
	var markId = data.markId;
	var marks = data.marks;
	var markModel = require('../db/mark');
	markModel.update({_id: markId}, {$set: {mark: marks}}, function(error, mark){
		res.end('ok');
	});
});

/********** 工具函数,选择连接的数据表 **********/
function getModel(type){
	type = type + ''; // 防止传递过来的是整形
	switch(type){
		case '1':
			return require("../db/question/multipleChoice");
		case '2':
			return require("../db/question/blank");
		case '3':
			return require("../db/question/judgement");
		case '4':
			return require("../db/question/definition");
		case '5':
			return require("../db/question/saq");
		case '6':
			return require("../db/question/application");
		default:
			return require("../db/question/singleChoice");
	}
}

module.exports = router;