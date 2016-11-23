var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var PaperSchema = new Schema({
	title: {type: String, default: '试卷'},
	totalMark: {type: Number, default: 0},
	duration: {type: Number, default: 120},
	isPublished: {type: Boolean, default: false},
	teacher: String,
	singleChoice: [String],
	singleChoicePoint: {type: Number, default: 1},
	multipleChoice: [String],
	multipleChoicePoint: {type: Number, default: 2},
	blank: [String],
	blankPoint: {type: Number, default: 1},
	judgement: [String],
	judgementPoint: {type: Number, default: 2},
	definition: [String],
	definitionPoint: {type: Number, default: 3},
	saq: [String],
	saqPoint: {type: Number, default: 4},
	application: [String],
	applicationPoint: {type: Number, default: 10}
},{versionKey: false});
var PaperModel = mongoose.model("papers", PaperSchema);
module.exports = PaperModel;