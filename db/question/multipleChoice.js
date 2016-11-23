var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var MultipleChoiceSchema = new Schema({
	title: String,
	a: String,
	b: String,
	c: String,
	d: String,
	answer: [String]
},{versionKey: false});
var MultipleChoice = mongoose.model("multiplechoices", MultipleChoiceSchema);
module.exports = MultipleChoice;