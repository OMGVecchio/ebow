var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var SaqSchema = new Schema({
	title: String,
	answer: String
},{versionKey: false});
var Saq = mongoose.model("saqs", SaqSchema);
module.exports = Saq;