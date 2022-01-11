const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		maxLength: 20,
	},
	password: {
		type: String,
		required: true,
		minLength: 8,
	},
});

module.exports = User = mongoose.model('user', UserSchema);
