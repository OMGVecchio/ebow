var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var MarkSchema = new Schema({
	studentId: {type: String, required: true},
	examId: {type: String, required: true},
	title: {type: String, default: '考试'},
	mark: {type: Number, default: -1},
	singleChoice: [{}],
	multipleChoice: [{}],
	blank: [{}],
	judgement: [{}],
	definition: [{}],
	saq: [{}],
	application: [{}]
},{versionKey: false});
var MarkModel = mongoose.model("marks", MarkSchema);
module.exports = MarkModel;