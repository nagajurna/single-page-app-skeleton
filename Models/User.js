const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const crypto = require('crypto');
const bCrypt = require('bcrypt');
const base64url = require('base64url');
const ERR = require('../utils/errMessages');

let reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
let emailMatch = [reg, ERR.MAILINVALID];

let userSchema = new Schema({
	_id: Schema.Types.ObjectId,
	name: {	type: String, required: ERR.REQUIRED, maxlength: [25, ERR.NAMEMAX] },
	email: { type: String, required: ERR.REQUIRED, match: emailMatch },
	password: { type: String, required: ERR.REQUIRED, minlength: [6, ERR.PASSMIN] },
	admin: { type:  Boolean },
	created_at: { type: Date },
	updated_at: { type: Date, default: Date.now },
	remember_token: { type: String },
	reset_token: {type: String },
	reset_sent_at: { type: Date }
});


userSchema.statics.createHash = (string) => {
	 return bCrypt.hashSync(string, bCrypt.genSaltSync(10), null);
};

userSchema.statics.createToken = () => {
	//create a token
	let token = base64url(crypto.randomBytes(64));
	//encrypt token
	let encryptedToken = bCrypt.hashSync(token, bCrypt.genSaltSync(10), null);
	//return both
	return { token: token, encryptedToken: encryptedToken };
};

userSchema.methods.validPassword = (user, string) => {
	 return bCrypt.compareSync(string, user.password);
};

userSchema.methods.validRememberToken = (user, string) => {
	 return bCrypt.compareSync(string, user.remember_token);
};

userSchema.methods.validResetToken = (user, string) => {
	 return bCrypt.compareSync(string, user.reset_token);
};



module.exports = mongoose.model('User', userSchema);
