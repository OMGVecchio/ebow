var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var BlankSchema = new Schema({
	title: String,
	answer: [String]
},{versionKey: false});
var Blank = mongoose.model("blanks", BlankSchema);
module.exports = Blank;