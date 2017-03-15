'use strict';
const express = require('express');
const router = express.Router();
//packages
const mongoose = require('mongoose');
const Q = require('q');
const crypto = require('crypto');
const base64url = require('base64url');
const Entities = require('html-entities').XmlEntities;
const nodemailer = require('nodemailer');
//model
const User = require('../Models/User');
//errors messages
const ERR = require('../utils/errMessages');
const emailRegExp = require('../utils/emailReg');

//node mailer transporter object
let transporter = nodemailer.createTransport({
    service: process.env.MAIL_SERVICE,//any service (gmail,sendgrid,mailgun,...)
    auth: {
        user: process.env.MAIL_ADDRESS,
        pass: process.env.MAIL_PASSWORD
    }
});

//USERS
//MIDDLEWARE : FORM VALIDATION
let preValidation = (req, res, next) => {
	//REGISTER
	if(req.method === 'POST' && req.path === '/users/') {
		let error = {};
		error.errors = {};
		
		//add errors.name to error
		if(!req.body.name) { 
			error.errors.name = {} ; error.errors.name.message = ERR.REQUIRED;
		} else if(req.body.name.length>25) { 
			error.errors.name = {} ; error.errors.name.message = ERR.NAMEMAX;
		}
		//add errors.email to error
		if(!req.body.email) { 
			error.errors.email = {} ; error.errors.email.message = ERR.REQUIRED;
		} else if(!req.body.email.match(emailRegExp)) { 
			error.errors.email = {} ; error.errors.email.message = ERR.MAILINVALID;
		} 
		//add errors.password to error
		if(!req.body.password) { 
			error.errors.password = {} ; error.errors.password.message = ERR.REQUIRED;
		} else if(req.body.password.length<6) { 
			error.errors.password = {} ; error.errors.password.message = ERR.PASSMIN;
		}
		//add errors.password_confirm to error
		if(!req.body.password_confirm) { 
			error.errors.password_confirm = {} ; error.errors.password_confirm.message = ERR.REQUIRED;
		} else if(req.body.password_confirm !== req.body.password) { 
			error.errors.password_confirm = {} ; error.errors.password_confirm.message = ERR.PASSMISMATCH;
		}
		
		if(error.errors.name || error.errors.email || error.errors.password  || error.errors.password_confirm) {
			error.name = 'ValidationError';
			return res.json({loggedIn: false, error: error});
		} else {
			//UNIQUENESS
			//Name
			User
			.findOne({name :  req.body.name })
			.exec()//returns a promise
			.then( user => {
				if(user) {
					res.json({loggedIn: false, error: { name: "ValidationError", errors: { name: { message: ERR.NAMEUNIQUE }}}});//returns nothing
				} else {
					let query = User.findOne({email :  req.body.email });
					return query.exec();//returns a promise
				}
			})//Email
			.then( user => {
				if(user===undefined) { return; }//if nothing's returned, means that res already sent
				if(user) {
					res.json({loggedIn: false, error: { name: "ValidationError", errors: { email: { message: ERR.MAILUNIQUE }}}});
				} else {
					next();
				}
			})
			.catch( err => {
				console.log(err);
				return res.json({loggedIn: false, error: {name: "serverError", message: ERR.SERVER}});
			});			
		}	
					
	//LOGIN	
	} else if (req.method === 'POST' && req.path === '/login') {
		let error = {};
		error.errors = {};
		
		//add errors.email to error
		if(!req.body.email) { 
			error.errors.email = {} ;
			error.errors.email.message = ERR.REQUIRED;
		}
		//add errors.password to error
		if(!req.body.password) { 
			error.errors.password = {} ;
			error.errors.password.message = ERR.REQUIRED;
		}
		
		if( error.errors.email || error.errors.password ) {
			error.name = 'ValidationError';
			return res.json({loggedIn: false, error: error});
		} else {
			next();
		}
	//MODIF	password
	} else if (req.method === 'PUT' && req.path.match(/\/users\/password\/.+$/)) {
		let id = req.params.id;
		
		let error = {};
		error.errors = {};
		
		//add errors.password to error
		if(!req.body.password) { 
			error.errors.password = {} ; error.errors.password.message = ERR.REQUIRED;
		}
		//add errors.password_new to error
		if(!req.body.password_new) { 
			error.errors.password_new = {} ; error.errors.password_new.message = ERR.REQUIRED;
		} else if(req.body.password_new.length<6) { 
			error.errors.password_new = {} ; error.errors.password_new.message = ERR.PASSMIN;
		}
		//add errors.password_new_confirm to error
		if(!req.body.password_new_confirm) { 
			error.errors.password_new_confirm = {} ; error.errors.password_new_confirm.message = ERR.REQUIRED;
		} else if(req.body.password_new_confirm!== req.body.password_new) { 
			error.errors.password_new_confirm = {} ; error.errors.password_new_confirm.message = ERR.PASSMISMATCH;
		}
		
		if( error.errors.password || error.errors.password_new || error.errors.password_new_confirm ) {
			error.name = 'ValidationError';
			return res.json({updated: false, error: error});
		} else {
			next();
		}
		
	//MODIF	
	} else if (req.method === 'PUT' && req.path.match(/\/users\/.+$/) && req.params.id) {
		let id = req.params.id;
		
		let error = {};
		error.errors = {};
		
		//add errors.name to error
		if(!req.body.name) { 
			error.errors.name = {} ; error.errors.name.message = ERR.REQUIRED;
		} else if(req.body.name.length>25) { 
			error.errors.name = {} ; error.errors.name.message = ERR.NAMEMAX;
		}
		
		//add errors.email to error
		if(!req.body.email) { 
			error.errors.email = {} ; error.errors.email.message = ERR.REQUIRED;
		} else if(!req.body.email.match(emailRegExp)) { 
			error.errors.email = {} ; error.errors.email.message = ERR.MAILINVALID;
		}
		
		//add errors.password to error
		if(!req.body.password) { 
				error.errors.password = {} ; error.errors.password.message = ERR.REQUIRED;
		}
		
		if(error.errors.name || error.errors.email || error.errors.password) {
			error.name = 'ValidationError';
			return res.json({updated: false, error: error});
		} else {
			//UNIQUENESS
			//name
			User
			.find({ name :  req.body.name })
			.exec()//returns a promise
			.then( users => {
				//check that name doesn't exist but possibly for our user
				let nameUnique = true;
				for(let i = 0; i<users.length; i++) {
					if(users[i]._id.toString() !== id) {
						nameUnique = false;
						break;
					} 
				}
				
				if(nameUnique===false) {
					res.json({updated: false, error: { name: "ValidationError", errors: { name: { message: ERR.NAMEUNIQUE }}}});//returns nothing
				} else {
					let query = User.find({ email: req.body.email });
					return query.exec();//returns a promise
				}
			})//email
			.then( users => {
				if(users===undefined) { return; }//if nothing's returned, means that res already sent
				//check that email doesn't exist but possibly for our user
				let mailUnique = true;
				for(let i = 0; i<users.length; i++) {
					if(users[i]._id.toString() !== id) {
						mailUnique = false;
						break;
					}
				}
				
				if(mailUnique===false) {
					res.json({updated: false, error: { name: "ValidationError", errors: { email: { message: ERR.MAILUNIQUE }}}});
				} else {
					next();
				}
			})
			.catch( err => {
				return res.json({updated: false, error: {name: "serverError", message: ERR.SERVER }});
			});
		}
	//PASSWORD RESET
	} else if(req.method === 'POST' && req.path ==='/password_reset/') {
		let error = {};
		error.errors = {};
		//add errors.email to error
		if(!req.body.email) { 
			error.errors.email = {} ; error.errors.email.message = ERR.REQUIRED;
		} else if(!req.body.email.match(emailRegExp)) { 
			error.errors.email = {} ; error.errors.email.message = ERR.MAILINVALID;
		}
		
		if(error.errors.email) {
			error.name = 'ValidationError';
			return res.json({ emailSent: false, error: error });
		} else {
			next();
		}
	//PASSWORD RESET EDIT
	} else if(req.method === 'PUT' && req.path ==='/password_reset/edit') {
		let error = {};
		error.errors = {};
		
		//add errors.password to error
		if(!req.body.password) { 
			error.errors.password = {} ; error.errors.password.message = ERR.REQUIRED;
		} else if(req.body.password.length<6) { 
			error.errors.password = {} ; error.errors.password.message = ERR.PASSMIN;
		}
		//add errors.password_confirm to error
		if(!req.body.password_confirm) { 
			error.errors.password_confirm = {} ; error.errors.password_confirm.message = ERR.REQUIRED;
		} else if(req.body.password_confirm !== req.body.password) { 
			error.errors.password_confirm = {} ; error.errors.password_confirm.message = ERR.PASSMISMATCH;
		}
					
		if(error.errors.password || error.errors.password_confirm) {
			error.name = 'ValidationError';
			return res.json({ reset: false, error: error });
		} else {
			next();
		}
	}
}

//ROUTES
//register
router.post('/users/', preValidation, (req, res, next) => {
	
	let entities = new Entities();
	let admin = (req.body.admin ? req.body.admin : false);//FOR TEST ONLY, COMMENT FOR PRODUCTION (SECURITY PROBLEM)
	let newUser = new User({ _id: new mongoose.Types.ObjectId,
							 name: entities.encode(req.body.name),
							 password: User.createHash(req.body.password),
							 email: req.body.email,
							 admin: admin,//FOR TEST ONLY, "false" FOR PRODUCTION (SECURITY PROBLEM)
							 created_at: Date.now() });
								
	newUser.save()//returns a promise
	.then(function(user) {
		//Create session
		req.session.user = newUser._id;
		//User
		let currentUser = {};
		currentUser.id = newUser._id;
		currentUser.name = newUser.name;
		currentUser.email = newUser.email;
		currentUser.admin = newUser.admin;
		//Return user
		res.json({loggedIn: true, user: currentUser});
	})
	.catch( err => {
		console.log(err);
		return res.json({loggedIn: false, error: {name: "serverError", message: ERR.SERVER }});
	});
			
});

//login
router.post('/login', preValidation, (req, res, next) => {
	let token;
	
	User
	.findOne({ email: req.body.email })
	.exec()//returns a promise
	.then( user => {
		
		if(!user || !user.validPassword(user, req.body.password)) {
			//IF !USER OR !VALID PASSWORD
			//Send AuthentificationError error
			res.json({loggedIn: false, error: { name: "AuthentificationError", message: ERR.MISMATCH }});//returns nothing
		} else {
			//IF USER AND VALID PASSWORD
			//Create session
			req.session.user = user._id;
			//Remember me
			if(!req.body.remember_me) {//if no remember_me
				//User
				let currentUser = {};
				currentUser.id = user._id;
				currentUser.name = user.name;
				currentUser.email = user.email;
				currentUser.admin = user.admin;
				//Send user
				res.json({ loggedIn: true, user: currentUser, remember: false });//returns nothing
			} else {
				token = User.createToken();
				user.remember_token = token.encryptedToken;
				return user.save();//returns a promise	
			} 
		}
	}).then ( user => {
		if( user===undefined ) { return; }//if nothing's returned, means that res already sent
		//Create cookies
		let tenYears = 10 * 365 * 24 * 3600000; //10 years
		res.cookie('_sqlt_rm_', token.token, { maxAge: tenYears, httpOnly: true });
		res.cookie('_sqlt_sr_', user._id, { signed: true, maxAge: tenYears, httpOnly: true });
		//User
		let currentUser = {};
		currentUser.id = user._id;
		currentUser.name = user.name;
		currentUser.email = user.email;
		currentUser.admin = user.admin;
		//Send user
		res.json({ loggedIn: true, user: currentUser, remember: true });
	})
	.catch( err => {
		console.log(err);
		return res.json({loggedIn: false, error: {name: "serverError", message: ERR.SERVER }});
	});
	
});

//logout
router.get('/logout', (req, res, next) => {
	
	User
	.findById(req.session.user)
	.exec()//returns a promise
	.then( user => {
		//clear session and session cookie
		req.session.destroy();
		res.clearCookie('_sqlt_.sid');
		//remember_token
		if(!user.remember_token || user.remember_token==='') {
			res.json({loggedIn: false, user: null});//returns nothing
		} else  {
			//set remember_token to ''
			user.remember_token = '';
			return user.save();//returns a promise
		}
	}).then( user => {
		if(user===undefined) { return; }//if nothing's returned, means that res already sent
		//clear remember me cookies
		res.clearCookie('_sqlt_rm_');
		res.clearCookie('_sqlt_sr_');
		res.json({loggedIn: false, user: null});
	})
	.catch( err => {
		console.log(err);
		return res.json({loggedIn: false, error: {name: "serverError", message: ERR.SERVER }});
	});
	
});

//users
router.get('/users/', (req, res, next) => {
	
	User
	.findById(req.session.user)
	.exec()//returns a promise
	.then( user => {//checks that current user is admin
		if(!user.admin) {
			res.json({ admin: false, error: {name: "AuthentificationError", message: ERR.NONAUTH }});//returns nothing
		} else {
			return Q.fcall(function () {//returns a promise (value : user.admin)
				return user.admin;
			});
		}
	})
	.then( admin => {
		if(admin===undefined) { return; }//if nothing's returned, means that res already sent
		let query = User.find();
		return query.exec()//returns a promise
	})
	.then( users => {
		res.json({ users: users });
	})
	.catch( err => {
		console.log(err);
		return res.json({ error: {name: "serverError", message: ERR.SERVER }});
	});
		
});

//users/:id
router.get('/users/:id', (req, res, next) => {
	let id = req.params.id;
		
	let getUser = () => {
		User
		.findById(id)
		.exec()//returns a promise
		.then( user => {
			
			if(!user) {
				res.json({loggedIn: false, error: {name: "AuthentificationError", message: ERR.NONAUTH }});
			} else {
				let currentUser = {};
				currentUser.id = user._id;
				currentUser.name = user.name;
				currentUser.email = user.email;
				currentUser.admin = user.admin;
				currentUser.created_at = user.created_at;
				currentUser.updated_at = user.updated_at;
				res.json({ loggedIn: true, user: currentUser });
			}
		})
		.catch( err => {
			console.log(err);
			return res.json({ error: {name: "serverError", message: ERR.SERVER }});
		});
	}
	
	//if id !== req.session.user && req.session.user !== admin => no auth
	if(id!==req.session.user) {
		User
		.findById(req.session.user)
		.exec()
		.then( user => {
			if(!user) {
				return res.json({ loggedIn: false, error: {name: "AuthentificationError", message: ERR.NONAUTH }});
			} else if(!user.admin) {
				return res.json({ loggedIn: false, error: {name: "AuthentificationError", message: ERR.NONAUTH }});
			} else {
				getUser();
			}
		}).catch( err => {
			console.log(err);
			return res.json({ error: {name: "serverError", message: ERR.SERVER }});
		});
	} else {
		getUser();
	}
	
});

//update user
router.put('/users/:id', preValidation, (req, res, next) => {
	//if id !== req.session.user => no auth
	let id = req.params.id;
	if(id!==req.session.user) {
		return res.json({ updated: false, error: {name: "AuthentificationError", message: ERR.NONAUTH }});
	}
	
	User
	.findById(id)
	.exec()//returns a promise
	.then( user => {
		
		if(!user) {
			res.json({updated: false, error: { name: "AuthentificationError", message: ERR.NONAUTH }});//returns nothing
		} else if (!user.validPassword(user, req.body.password)) {
			res.json({updated: false, error: { name: "AuthentificationError", message: ERR.PASSERR }});//returns nothing
		} else {
			user.name = req.body.name;
			user.email = req.body.email;
			user.updated_at = Date.now();
			return user.save();//returns a promise
		}
	})
	.then( user => {
		if(user===undefined) { return; }//if nothing's returned, means that res already sent
		//User
		let currentUser = {};
		currentUser.id = user._id;
		currentUser.name = user.name;
		currentUser.email = user.email;
		currentUser.admin = user.admin;
		//sends user
		res.json({updated: true, user: currentUser});
	})
	.catch( err => {
		console.log(err);
		return res.json({updated: false, error: {name: "serverError", message: ERR.SERVER }});
	})
		
});

//update user password
router.put('/users/password/:id', preValidation, (req, res, next) => {
	//if id !== req.session.user => no auth
	let id = req.params.id;
	if(id!==req.session.user) {
		return res.json({ updated: false, error: {name: "AuthentificationError", message: ERR.NONAUTH }});
	}
	
	User
	.findById(id)
	.exec()//returns a promise
	.then( user => {
		
		if(!user) {
			res.json({updated: false, error: { name: "AuthentificationError", message: ERR.NONAUTH }});//returns nothing
		} else if (!user.validPassword(user, req.body.password)) {
			res.json({updated: false, error: { name: "AuthentificationError", message: ERR.PASSERR }});//returns nothing
		} else {
			user.password = User.createHash(req.body.password_new);
			user.updated_at = Date.now();
			return user.save();//returns a promise
		}
	})
	.then( user => {
		if(user===undefined) { return; }//if nothing's returned, means that res already sent
		//User
		let currentUser = {};
		currentUser.id = user._id;
		currentUser.name = user.name;
		currentUser.email = user.email;
		currentUser.admin = user.admin;
		//sends user
		res.json({updated: true, user: currentUser});
	})
	.catch( err => {
		console.log(err);
		return res.json({updated: false, error: {name: "serverError", message: ERR.SERVER }});
	})
		
});

//delete user
router.delete('/users/:id', (req, res, next) => {
	
	User
	.findById(req.session.user)
	.exec()//returns a promise
	.then( user => {//checks that current user is admin
		if(!user.admin) {
			res.json({ admin: false, error: {name: "AuthentificationError", message: ERR.NONAUTH }});//returns nothing
		} else {
			return Q.fcall(function () {//returns a promise (value : user.admin)
				return user.admin;
			});
		}
	})
	.then( admin => {
		if(admin===undefined) { return; }//if nothing's returned, means that res already sent
		let id = req.params.id
		let query = User.remove({ _id: id });
		return query.exec();//returns a promise
	})
	.then( deleted => {
		if(deleted===undefined) { return; }//if nothing's returned, means that res already sent
		res.json( { user: null } );
	})
	.catch( err => {
		console.log(err);
		return res.json({loggedIn: true, error: {name: "serverError", message: ERR.SERVER }});
	})
	
});

//currentuser
router.get('/currentuser', (req, res, next) => {
	if(req.session.user) {//IF SESSION
		User.findOne({_id :  req.session.user }, (err, user) => {
			if(err) {
				console.log(err);
				return res.json({ loggedIn: false, user: null });
			}
			if(!user) {
				return res.json({ loggedIn: false, user: null });
			}
			let currentUser = {};
			currentUser.id = user._id;
			currentUser.name = user.name;
			currentUser.email = user.email;
			currentUser.admin = user.admin;
			return res.json({ loggedIn: true, user: currentUser });
		});
	} else if(req.cookies['_sqlt_rm_'] && req.signedCookies["_sqlt_sr_"]) {//ELSE IF REMEMBER_ME TOKEN
		let id = req.signedCookies["_sqlt_sr_"];
		let rememberToken = req.cookies['_sqlt_rm_'];
		
		User.findOne({_id: id}, function(err, user) {
			if(err) {
				console.log(err);
				return res.json({ loggedIn: false, user: null });
			}
			
			if(!user) {
				return res.json({ loggedIn: false, user: null });
			}
			
			if(user.validRememberToken(user, rememberToken)) {
				req.session.user = user._id;
				let currentUser = {};
				currentUser.id = user._id;
				currentUser.name = user.name;
				currentUser.email = user.email;
				currentUser.admin = user.admin;
				return res.json({loggedIn: true, user: currentUser });
			} else {
				return res.json({ loggedIn: false, user: null });
			}
		});
	} else {
		return res.json({ loggedIn: false, user: null });
	}
	
});

//password_reset/
router.post('/password_reset/', preValidation, (req, res, next) => {
	let email = req.body.email;
	let token;	
	
	User
	.findOne({email : email })
	.exec()//returns a promise
	.then( user => {
		if(!user) {
			res.json({emailSent: false, error: { name: "ValidationError", errors: { email: { message: ERR.MAILNOTFOUND }}}});//returns nothing
		} else {
			//Create token and save user
			token = User.createToken();
			user.reset_token = token.encryptedToken;
			user.reset_sent_at = Date.now();
			return user.save();//returns a promise	
		}
	})
	.then( user => {
		if(user===undefined) { return; }//if nothing's returned, means that res already sent
		//Send mail
		let htmlMessage = '<p>' + user.name + ', cliquez sur ce lien suivant afin de créer un nouveau mot de passe :</p>' +
						  '<p><a href="http://localhost:3000/#/users/password_reset/' + token.token + '/edit?email=' + user.email + '">créer un nouveau mot de passe</a></p>' + 
						  '<p>Ce lien sera actif pendant 2 heures.</p>' +
						  '<p>Si vous n\'avez pas sollicité la création d\'un nouveau mot de passe, ignorez ce message, votre mot de passe ne sera pas modifié. </p>';
		let mailOptions = {
			from: '<' + process.env.MAIL_ADDRESS + '>', 
			to: process.env.MAIL_ADDRESS, //req.body.email or process.env.MAIL_ADDRESS (dev)
			subject: 'app - mot de passe oublié',
			html: htmlMessage
		};
		
		return transporter.sendMail(mailOptions);//returns a promise
	})
	.then( info => {
		if(info===undefined) { return; }//if nothing's returned, means that res already sent
		if(info.accepted.length > 0) {
			return res.json({ emailSent: true, email: email });
		} else {
			return res.json({ emailSent: false, error: {name: "serverError", message: ERR.SERVER}});
		}
	})
	.catch( err => {
		console.log(err);
		return res.json({emailSent: false, error: {name: "serverError", message: ERR.SERVER}});
	});	
});

//password_reset/edit
router.put('/password_reset/edit', preValidation, (req, res, next) => {
	//do something in the case where user is authenticated
	if(req.session.user) {
		return res.json({ reset: false, error: {name: "AuthentificationError", message: ERR.RESETALREADYLOGGED }});
	}
		
	User
	.findOne({ email: req.body.email })
	.exec()//returns a promise
	.then( user => {
		if(!user) {//if no user
			res.json({reset: false, error: {name: "AuthentificationError", message: ERR.NONAUTH }});//returns nothing
		} else if(!user.validResetToken(user,req.body.token)) {//if wrong token
			res.json({reset: false, error: {name: "AuthentificationError", message: ERR.TOKENNONVALID }});//returns nothing
		} else if(Date.now() - user.reset_sent_at.getTime() > 7200000) {//if reset_sent_at > 2 hours
			res.json({reset: false, error: {name: "AuthentificationError", message: ERR.TOKENEXPIRED }});//returns nothing
		} else {
			user.reset_token = '';
			user.reset_sent_at = '';
			user.password = User.createHash(req.body.password);
			user.updated_at = Date.now();
			return user.save();//returns a promise	
		}
	})
	.then( user => {
		if(user===undefined) { return; }//if nothing's returned, means that res already sent
		return res.json ({ reset: true, message: 'Votre nouveau mot de passe a été enregistré' });
	});
	
});

module.exports = router;
