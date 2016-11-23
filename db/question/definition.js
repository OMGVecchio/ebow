var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var DefinitionSchema = new Schema({
	title: String,
	answer: String
},{versionKey: false});
var Definition = mongoose.model("definitions", DefinitionSchema);
module.exports = Definition;