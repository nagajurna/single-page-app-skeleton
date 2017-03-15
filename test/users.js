//test.js
describe('POST /users/', function() {
	
	var id;
	var agent = chai.request.agent(app)
	
	before(function(done) {
		agent
		.post('/users/users/')
		.send({name: 'nagajurna', email: 'nagajurna@gmail.com', password: 'machin', password_confirm: 'machin'})
		.end(function(err, res) {
			if(err) return done(err);
			id = res.body.user.id
			done();
		});
	});
	
	after(function(done) {
		agent
		.get('/users/logout')//logout user
		.end(function(err,res) {
			if(err) return done(err);
			
			agent
			.post('/users/users/')//register an admin
			.send({name: 'testAdmin', email: 'testAdmin@gmail.com', password: 'machin', password_confirm: 'machin', admin: true})
			.end(function(err, res) {
				if(err) return done(err);
				adminId = res.body.user.id
				agent
				.delete('/users/users/' + id)//admin delete user
				.end(function(err, res) {
					if(err) return done(err);
					
					agent
					.delete('/users/users/' + adminId)//admin suicide
					.end(function(err, res) {
						if(err) return done(err);
						done();
					});
				});
			});
		});
	});
	
	it('should not register without name', function(done) {
		request
		.post('/users/users/')
		.send({name: '', email: 'paul@gmail.com', password: 'machin', password_confirm: 'machin'})
		.end(function(err, res) {
			if(err) return done(err);
			expect(res).to.have.status(200);
			expect(res).to.be.json;
			expect(res.body.loggedIn).to.equal(false);
			expect(res.body.error.errors.name.message).to.equal('Champ obligatoire');
			done();
		});
	});
	
	it('should not register without email', function(done) {
		request
		.post('/users/users/')
		.send({name: 'paul', email: '', password: 'machin', password_confirm: 'machin'})
		.end(function(err, res) {
			if(err) return done(err);
			expect(res).to.have.status(200);
			expect(res).to.be.json;
			expect(res.body.loggedIn).to.equal(false);
			expect(res.body.error.errors.email.message).to.equal('Champ obligatoire');
			done();
		});
	});
	
	it('should not register without valid email', function(done) {
		request
		.post('/users/users/')
		.send({name: 'paul', email: 'paul@gmail', password: 'machin', password_confirm: 'machin'})
		.end(function(err, res) {
			if(err) return done(err);
			expect(res).to.have.status(200);
			expect(res).to.be.json;
			expect(res.body.loggedIn).to.equal(false);
			expect(res.body.error.errors.email.message).to.equal('Adresse invalide');
			done();
		});
	});
	
	it('should not register without password', function(done) {
		request
		.post('/users/users/')
		.send({name: 'paul', email: 'paul@gmail.com', password: '', password_confirm: 'machin'})
		.end(function(err, res) {
			if(err) return done(err);
			expect(res).to.have.status(200);
			expect(res).to.be.json;
			expect(res.body.loggedIn).to.equal(false);
			expect(res.body.error.errors.password.message).to.equal('Champ obligatoire');
			done();
		});
	});
	
	it('should not register without password less than 6 characters', function(done) {
		request
		.post('/users/users/')
		.send({name: 'paul', email: 'paul@gmail.com', password: 'truc', password_confirm: 'truc'})
		.end(function(err, res) {
			if(err) return done(err);
			expect(res).to.have.status(200);
			expect(res).to.be.json;
			expect(res.body.loggedIn).to.equal(false);
			expect(res.body.error.errors.password.message).to.equal('Mot de passe trop court (6 caractères minimum)');
			done();
		});
	});
	
	it('should not register without password confirmation', function(done) {
		request
		.post('/users/users/')
		.send({name: 'paul', email: 'paul@gmail.com', password: 'machin', password_confirm: ''})
		.end(function(err, res) {
			if(err) return done(err);
			expect(res).to.have.status(200);
			expect(res).to.be.json;
			expect(res.body.loggedIn).to.equal(false);
			expect(res.body.error.errors.password_confirm.message).to.equal('Champ obligatoire');
			done();
		});
	});
	
	it('should not register without password confirmation same as password', function(done) {
		request
		.post('/users/users/')
		.send({name: 'paul', email: 'paul@gmail.com', password: 'machin', password_confirm: 'machine'})
		.end(function(err, res) {
			if(err) return done(err);
			expect(res).to.have.status(200);
			expect(res).to.be.json;
			expect(res.body.loggedIn).to.equal(false);
			expect(res.body.error.errors.password_confirm.message).to.equal('Mot de passe différent');
			done();
		});
	});
	
	it('should not register with already registered name', function(done) {
		request
		.post('/users/users/')
		.send({name: 'nagajurna', email: 'paul@gmail.com', password: 'machin', password_confirm: 'machin'})
		.end(function(err, res) {
			if(err) return done(err);
			expect(res).to.have.status(200);
			expect(res).to.be.json;
			expect(res.body.loggedIn).to.equal(false);
			expect(res.body.error.errors.name.message).to.equal('Nom d\'utilisateur déjà utilisé');
			done();
		});
	});
	
	it('should not register with already registered email', function(done) {
		request
		.post('/users/users/')
		.send({name: 'candrakirti', email: 'nagajurna@gmail.com', password: 'machin', password_confirm: 'machin'})
		.end(function(err, res) {
			if(err) return done(err);
			expect(res).to.have.status(200);
			expect(res).to.be.json;
			expect(res.body.loggedIn).to.equal(false);
			expect(res.body.error.errors.email.message).to.equal('Adresse mail déjà enregistrée');
			done();
		});
	});
	
});

describe('POST /login', function() {
	
	var id;
	var adminId;
	var agent = chai.request.agent(app)
	
	before(function(done) {//register an user
		agent
		.post('/users/users/')
		.send({name: 'nagajurna', email: 'nagajurna@gmail.com', password: 'machin', password_confirm: 'machin'})
		.end(function(err, res) {
			if(err) return done(err);
			id = res.body.user.id
			done();
		});
	});
	
	after(function(done) {
		agent
		.get('/users/logout')//logout user
		.end(function(err,res) {
			if(err) return done(err);
			
			agent
			.post('/users/users/')//register an admin
			.send({name: 'testAdmin', email: 'testAdmin@gmail.com', password: 'machin', password_confirm: 'machin', admin: true})
			.end(function(err, res) {
				if(err) return done(err);
				adminId = res.body.user.id
				agent
				.delete('/users/users/' + id)//admin delete user
				.end(function(err, res) {
					if(err) return done(err);
					
					agent
					.delete('/users/users/' + adminId)//admin suicide
					.end(function(err, res) {
						if(err) return done(err);
						done();
					});
				});
			});
		});
	});
	
	it('should not log without email', function(done) {
		agent
		.post('/users/login')
		.send({email: '', password: 'truc'})
		.end(function(err, res) {
			if(err) return done(err);
			expect(res).to.have.status(200);
			expect(res).to.be.json;
			expect(res.body.loggedIn).to.equal(false);
			expect(res.body.error.errors.email.message).to.equal('Champ obligatoire');
			done();
		});
	});
	
	it('should not log without password', function(done) {
		agent
		.post('/users/login')
		.send({email: 'paul@gmail.com', password: ''})
		.end(function(err, res) {
			if(err) return done(err);
			expect(res).to.have.status(200);
			expect(res).to.be.json;
			expect(res.body.loggedIn).to.equal(false);
			expect(res.body.error.errors.password.message).to.equal('Champ obligatoire');
			done();
		});
	});
	
	it('should not log with incorrect combination email/password', function(done) {
		agent
		.post('/users/login')
		.send({email: 'nagajurna@gmail.com', password: 'machine'})
		.end(function(err, res) {
			if(err) return done(err);
			expect(res).to.have.status(200);
			expect(res).to.be.json;
			expect(res.body.loggedIn).to.equal(false);
			expect(res.body.error.message).to.equal('Mauvaise combinaison identifiant/mot de passe');
			done();
		});
	});
	
	
});


describe('GET /users/:id', function() {
	
	var id;
	var adminId;
	var agent = chai.request.agent(app)
	
	before(function(done) {
		agent
		.post('/users/users/')
		.send({name: 'nagajurna', email: 'nagajurna@gmail.com', password: 'machin', password_confirm: 'machin'})
		.end(function(err, res) {
			if(err) return done(err);
			id = res.body.user.id
			done();
		});
	});
	
	after(function(done) {
		agent
		.get('/users/logout')//logout user
		.end(function(err,res) {
			if(err) return done(err);
			
			agent
			.post('/users/users/')//register an admin
			.send({name: 'testAdmin', email: 'testAdmin@gmail.com', password: 'machin', password_confirm: 'machin', admin: true})
			.end(function(err, res) {
				if(err) return done(err);
				adminId = res.body.user.id
				agent
				.delete('/users/users/' + id)//admin delete user
				.end(function(err, res) {
					if(err) return done(err);
					
					agent
					.delete('/users/users/' + adminId)//admin suicide
					.end(function(err, res) {
						if(err) return done(err);
						done();
					});
				});
			});
		});
	});
	
	it('should return the right user', function(done) {
		agent
		.get('/users/users/' + id)
		.end(function(err, res) {
			if(err) return done(err);
			expect(res).to.have.status(200);
			expect(res).to.be.json;
			expect(res.body.user.id).to.equal(id);
			expect(res.body.user.name).to.equal('nagajurna');
			expect(res.body.user.email).to.equal('nagajurna@gmail.com');
			done();
		});
	});
	
});

describe('SESSION', function() {
	
	var id;
	var adminId;
	var agent = chai.request.agent(app)
	
	after(function(done) {
		agent
		.get('/users/logout')//logout user
		.end(function(err,res) {
			if(err) return done(err);
			
			agent
			.post('/users/users/')//register an admin
			.send({name: 'testAdmin', email: 'testAdmin@gmail.com', password: 'machin', password_confirm: 'machin', admin: true})
			.end(function(err, res) {
				if(err) return done(err);
				adminId = res.body.user.id
				agent
				.delete('/users/users/' + id)//admin delete user
				.end(function(err, res) {
					if(err) return done(err);
					
					agent
					.delete('/users/users/' + adminId)//admin suicide
					.end(function(err, res) {
						if(err) return done(err);
						done();
					});
				});
			});
		});
	});
	
	it('should create then destroy then eventually create a session with remember_me cookies', function(done) {
		agent
		.post('/users/users/')
		.send({name: 'nagajurna', email: 'nagajurna@gmail.com', password: 'machin', password_confirm: 'machin'})
		.end(function(err, res) {
			if(err) return done(err);
			id = res.body.user.id;
			expect(res.body.loggedIn).to.equal(true);
			expect(res).to.have.cookie('_sqlt_.sid');
			
			agent.get('/users/logout')
			.end(function(err,res) {
				if(err) return done(err);
				expect(res.body.loggedIn).to.equal(false);
				expect(res).not.to.have.cookie('_sqlt_.sid');
				
				agent.post('/users/login')
				.send({ email: 'nagajurna@gmail.com', password: 'machin', remember_me: true })
				.end(function(err, res) {
					if(err) return done(err);
					expect(res.body.loggedIn).to.equal(true);
					expect(res).to.have.cookie('_sqlt_.sid');
					expect(res).to.have.cookie('_sqlt_rm_');
					expect(res).to.have.cookie('_sqlt_sr_');
					done();
				});
			});
		});
	});	
});


describe('GET /currentuser', function() {
	
	var id;
	var adminId;
	var agent = chai.request.agent(app)
	
	after(function(done) {
		agent
		.get('/users/logout')//logout user
		.end(function(err,res) {
			if(err) return done(err);
			
			agent
			.post('/users/users/')//register an admin
			.send({name: 'testAdmin', email: 'testAdmin@gmail.com', password: 'machin', password_confirm: 'machin', admin: true})
			.end(function(err, res) {
				if(err) return done(err);
				adminId = res.body.user.id
				agent
				.delete('/users/users/' + id)//admin delete user
				.end(function(err, res) {
					if(err) return done(err);
					
					agent
					.delete('/users/users/' + adminId)//admin suicide
					.end(function(err, res) {
						if(err) return done(err);
						done();
					});
				});
			});
		});
	});
	
	it('should get logged user as current user', function(done) {
		agent
		.post('/users/users/')
		.send({name: 'candrakirti', email: 'candrakirti@gmail.com', password: 'machin', password_confirm: 'machin'})
		.end(function(err, res) {
			if(err) return done(err);
			id = res.body.user.id;
			expect(res.body.loggedIn).to.equal(true);
			expect(res).to.have.cookie('_sqlt_.sid');
			
			agent.get('/users/currentuser')
			.end(function(err,res) {
				if(err) return done(err);
				expect(res.body.loggedIn).to.equal(true);
				expect(res.body.user.id).to.equal(id);
				expect(res.body.user.name).to.equal('candrakirti');
				expect(res.body.user.email).to.equal('candrakirti@gmail.com');
				done();
				
			});
		});
	});
	
	
	
	
});

describe('GET /delete', function() {
	
	var id;
	var id2;
	var adminId;
	
	
	before(function(done) {
		var agent = chai.request.agent(app)
		
		agent
		.post('/users/users/')
		.send({name: 'nagajurna', email: 'nagajurna@gmail.com', password: 'machin', password_confirm: 'machin'})
		.end(function(err, res) {
			if(err) return done(err);
			id = res.body.user.id
			
			agent
			.get('/users/logout')//logout user
			.end(function(err,res) {
				if(err) return done(err);
				done();
			});
		});
	});
	
	after(function(done) {
		var agent = chai.request.agent(app)
		
		agent
		.post('/users/users/')//register an admin
		.send({name: 'testAdmin', email: 'testAdmin@gmail.com', password: 'machin', password_confirm: 'machin', admin: true})
		.end(function(err, res) {
			if(err) return done(err);
			adminId = res.body.user.id
			agent
			.delete('/users/users/' + id)//admin delete user1
			.end(function(err, res) {
				if(err) return done(err);
				
				agent
				.delete('/users/users/' + id2)//admin delete user2
				.end(function(err, res) {
					if(err) return done(err);
				
					agent
					.delete('/users/users/' + adminId)//admin suicide
					.end(function(err, res) {
						if(err) return done(err);
						done();
					});
				});
			});
		});
	});
	
	it('should not be able to delete user if not admin', function(done) {
		var agent = chai.request.agent(app)
		
		agent
		.post('/users/users/')
		.send({name: 'candrakirti', email: 'candrakirti@gmail.com', password: 'machin', password_confirm: 'machin'})
		.end(function(err, res) {
			if(err) return done(err);
			id2 = res.body.user.id;
			expect(res.body.loggedIn).to.equal(true);
			expect(res).to.have.cookie('_sqlt_.sid');
			
			agent
			.delete('/users/users/' + id)
			.end(function(err,res) {
				if(err) return done(err);
				expect(res.body.admin).to.equal(false);
				expect(res.body.error.name).to.equal('AuthentificationError');
				expect(res.body.error.message).to.equal('Votre requête ne peut pas aboutir');
				
				agent
				.get('/users/logout')//logout user
				.end(function(err, res) {
					if(err) return done(err);
					done();
				});						
			});
		});
	});
	
	
	
	
});
