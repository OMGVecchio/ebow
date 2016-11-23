var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var TeacherSchema = new Schema({
	_id: {type: Number, required: true, unique: true},
	password: {type: String, required: true, default: '88888888'},
	type: {type: Number, default: 1},
	brief: {type: String, default: '这个人很懒,什么都没留下~'},
	name: {type:String, default: '某个人'},
	gender: {type: String, enum: ['男', '女'], default: '男'},
	college: {type: String, default: '00000000'},
	paper: {type: [String], default: []},
	exams: {type: [String], default: []}
},{versionKey: false});
var TeacherModel = mongoose.model("teachers", TeacherSchema);
module.exports = TeacherModel;