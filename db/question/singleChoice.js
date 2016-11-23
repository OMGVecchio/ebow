var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var SingleChoiceSchema = new Schema({
	title: String,
	a: String,
	b: String,
	c: String,
	d: String,
	answer: String
},{versionKey: false});
var SingleChoice = mongoose.model("singlechoices", SingleChoiceSchema);
module.exports = SingleChoice;