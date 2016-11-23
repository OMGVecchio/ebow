var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var AdminSchema = new Schema({
	_id: {type: Number, required: true, unique: true},
	password: {type: String, required: true},
	type: {type: Number, default: 0},
	name: {type:String, default: '某个人'}
},{versionKey: false});
var AdminModel = mongoose.model("admins", AdminSchema);
module.exports = AdminModel;