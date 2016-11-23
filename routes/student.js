var express = require('express');
var router = express.Router();

/********* 学生信息管理 *********/
router.get('/info', function(req,res){
	var student = req.session.person;
	res.render('student/info',{
		title: '个人信息',
		userType: 0,
		pageItem: 0,
		user: student
	});
});
// 密码修改
router.post('/password-update', function(req, res){
	var id = req.session.person._id;
	var data = req.body;
	var studentModel = require('../db/users/student');
	studentModel.findOne({_id: id}, function(error, student_1){
		if(data.pwOrigin == student_1.password){
			studentModel.update({_id: id}, {$set: {password: data.pwNew}}, function(error, student_2){
				res.end('ok');
			});
		}else{
			res.end('error');
		}
	});
});

/********* 学生成绩管理 *********/
router.get('/score', function(req,res){
	var student = req.session.person;
	var page = req.query.page || 1;
	var href = '/student/score?status=ok';
	var studentModel = require('../db/users/student');
	studentModel.count(function(error, count){
		studentModel.findOne({_id: student._id}, function(error, student){
			var query = [];
			if(student.exams){
				var exams = student.exams;
				var length = exams.length;
				for(var i = 0; i < length; i++){
					var exam = exams[i];
					query.push({studentId: student._id, examId: exam});
				}
			}
			var markModel = require('../db/mark');
			markModel.find({$or: query}, null, {skip: (page-1)*10, limit: 10}, function(error, marks){
				res.render('student/score',{
					title: '成绩查询',
					userType: 0,
					pageItem: 1,
					user: student,
					marks: marks,
					count: count,
					pageNumber: page,
					href: href
				});
			});
		});
	});
});

/********* 学生考试管理 *********/
// 考试列表
router.get('/exam', function(req,res){
	var student = req.session.person;
	var href = '/student/exam?status=ok';
	var page = req.query.page || 1;
	var studentModel = require('../db/users/student');
	studentModel.findOne({_id: student._id}, function(error, studentInfo){
		var studentExams = studentInfo.exams;
		var count = 0;
		var length = studentExams.length;
		var examArray = [];
		for(; count < length; count++){
			examArray.push({_id: studentExams[count]});
		}
		var examModel = require('../db/exam');
		examModel.count({$or: examArray}, function(error, count){
			examModel.find({$or: examArray}, null, {skip: (page-1)*10, limit: 10}, function(error, exams){
				res.render('student/exam-list',{
					title: '考试',
					userType: 0,
					pageItem: 2,
					user: student,
					exams: exams,
					count: count,
					pageNumber: page,
					href: href
				});
			});
		});
	});
});
// 考试主界面
router.get('/exam/:id', function(req,res){
	var student = req.session.person;
	var examId = req.params.id.split(':')[1];
	var examModel = require('../db/exam');
	examModel.findOne({_id: examId}, function(error, exam){
		// 判断是否在考试时间内,如果是,直接跳转考试页，否则跳转考试等待页
		var timing = new Date() - exam.time;
		if(timing < 0){
			res.render('student/exam-wait', {
				title: '考试时间未到',
				userType: 0,
				pageItem: 2,
				user: student,
				time: -timing
			});
		}else{
			var paperId = exam.paper;
			var paperModel = require('../db/paper');
			paperModel.findOne({_id: paperId}, function(error, paper){
				var data = {}; // 返回的数据
				data.title = paper.title;
				data.duration = paper.duration;
				data.totalMark = paper.totalMark;

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
											res.render('student/exam', {
												title: '考试',
												userType: 0,
												pageItem: 2,
												user: student,
												questions: data,
												examId: examId
											});
										});
									});
								});
							});
						});
					});
				});
			});
		}
	});
});
// 考试试卷提交(todo 需做判断,一个学生只能拥有一个此次考试的数据)
router.post('/exam-commit', function(req, res){
	var data = req.body;
	var examId = data.examId;
	var studentId = req.session.person._id;
	// mark数据表试题项
	var singleChoice = [];
	var multipleChoice = [];
	var blank = [];
	var judgement = [];
	var definition = [];
	var saq = [];
	var application = [];
	for(var index in data){
		if(index != 'examId'){
			var info = index.split('-');
			var questionType = info[0];
			var questionId = info[1];
			switch (questionType){
				case 'sc':
					singleChoice.push({questionId: questionId, answer: data[index]});
					break;
				case 'mc':
					multipleChoice.push({questionId: questionId, answer: data[index]});
					break;
				case 'blank':
					blank.push({questionId: questionId, answer: data[index]});
					break;
				case 'judgement':
					judgement.push({questionId: questionId, answer: data[index]});
					break;
				case 'definition':
					definition.push({questionId: questionId, answer: data[index]});
					break;
				case 'saq':
					saq.push({questionId: questionId, answer: data[index]});
					break;
				case 'application':
					application.push({questionId: questionId, answer: data[index]});
					break;
				default:
					break;
			}
		}
	}
	var markModel = require('../db/mark');
	var mark = new markModel({
		studentId: studentId,
		title: data['title'],
		examId: examId,
		mark: -1,
		singleChoice: singleChoice,
		multipleChoice: multipleChoice,
		blank: blank,
		judgement: judgement,
		definition: definition,
		saq: saq,
		application: application
	});
	mark.save(function(error, mark){
		res.redirect('/student/exam');
	});
});

/********** 工具函数 **********/
// 选择连接的数据表
function getModel(type){
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