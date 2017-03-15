//register.js
const register = function() {
	'use strict';
	
	//root element
	let root = document.querySelector("#register.side-content");
	//register button
	let registerBtn = root.querySelector("#registerButton");
	
	//register function
	let register = () => {
		//clear form errors
		root.querySelectorAll("#registerForm .error").forEach( element => {
			element.innerHTML = '';
		});
		//get user values from form
		let user = {};
		user.name = root.querySelector("#registerForm input[name=name]").value;
		user.email = root.querySelector("#registerForm input[name=email]").value;
		user.password = root.querySelector("#registerForm input[name=password]").value;
		user.password_confirm = root.querySelector("#registerForm input[name=password_confirm]").value;
		//ajax POST
		let options = { url: '/users/users/', method: 'POST', data: JSON.stringify(user) }
		utils.ajax(options).then( response => {
			let data = JSON.parse(response);
			if(!data.loggedIn) {//loggedIn===false => display errors
				if(data.error.name==='ValidationError') {
					if(data.error.errors) {
						if(data.error.errors.name) {
							root.querySelector("#registerForm #name .error").innerHTML = data.error.errors.name.message;
						}
						if(data.error.errors.email) {
							root.querySelector("#registerForm #email .error").innerHTML = data.error.errors.email.message;
						}
						if(data.error.errors.password) {
							root.querySelector("#registerForm #password .error").innerHTML = data.error.errors.password.message;
						}
						if(data.error.errors.password_confirm) {
							root.querySelector("#registerForm #password_confirm .error").innerHTML = data.error.errors.password_confirm.message;
						}
					}
				} else {
					root.querySelector("#registerForm #form").innerHTML = data.error.message;
				}
			} else {//loggedIn===true => redirect to users/:id
				let user = data.user;
				//redirect
				location.hash = (user.admin ? '#/admin' : '#/users/' + user.id);
				//refresh links
				utils.refreshUser(user);
				sideMenuService.hide();
			}
		});
		
	}
	
	//attach function to button
	root.querySelector("#registerButton").addEventListener("click", register, false);
	
	//input oninput => clear form errors
	root.querySelectorAll("#registerForm input").forEach( input => {
			input.addEventListener("input", e => {
				root.querySelector("#registerForm #" + e.currentTarget.name + " .error").innerHTML = '';
				root.querySelector("#registerForm #form").innerHTML = '';
			});
	});
	
	//go to login
	root.querySelector("#login").addEventListener('click', e => {
		utils.getFragment('/fragments/login/login.html', sideMenuService.container, login)
		.then( controller => { controller(); });
	}, false);

};

