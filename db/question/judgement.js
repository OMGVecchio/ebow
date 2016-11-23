var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var JudgementSchema = new Schema({
	title: String,
	answer: Boolean
},{versionKey: false});
var Judgement = mongoose.model("judgements", JudgementSchema);
module.exports = Judgement;