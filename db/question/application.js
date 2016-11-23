var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ApplicationSchema = new Schema({
	title: String,
	answer: String
},{versionKey: false});
var Application = mongoose.model("applications", ApplicationSchema);
module.exports = Application;