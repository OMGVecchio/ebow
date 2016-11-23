var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ExamSchema = new Schema({
	paper: {type: String, default: '考试'},
	title: String,
	time: {type: Date, required: true},
	teacher: {type: String, required: true},
	students: {type: [String], default: []},
	isFinished: {type: Boolean, default: false}
},{versionKey: false});
var ExamModel = mongoose.model("exams", ExamSchema);
module.exports = ExamModel;