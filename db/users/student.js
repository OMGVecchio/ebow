var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var StudentSchema = new Schema({
	_id: {type: Number, required: true, unique: true},
	password: {type: String, required: true, default: '8888888'},
	type: {type: Number, default: 2},
	brief: {type: String, default: '这个人很懒,什么都没留下~'},
	name: {type:String, default: '某个人'},
	gender: {type: String, enum: ['男', '女'], default: '男'},
	class: {type: String, default: '0000000'},
	college: {type: String, default: '00000000'},
	exams: {type: [String], default: []}
},{versionKey: false});
var StudentModel = mongoose.model("students", StudentSchema);
module.exports = StudentModel;