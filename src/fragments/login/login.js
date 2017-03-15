//login.js
const login = function() {
	'use strict';
	
	//rootElement
	let root = document.querySelector("#login.side-content");
	//login button
	let loginBtn = root.querySelector("#loginButton");
	
	//login function
	let login = () => {
		//clear form errors
		root.querySelectorAll("#loginForm .error").forEach( element => {
			element.innerHTML = '';
		});
		//get user values from form
		let user = {};
		user.email = root.querySelector("#loginForm input[name=email]").value;
		user.password = root.querySelector("#loginForm input[name=password]").value;
		user.remember_me = (root.querySelector("#loginForm input[name=remember_me]").checked ? true : false);
		//ajax POST
		let options = { url: '/users/login', method: 'POST', data: JSON.stringify(user) }
		utils.ajax(options).then( response => {
			let data = JSON.parse(response);
			if(!data.loggedIn) {//loggedIn===false => display errors
				if(data.error.name==='ValidationError') {
					if(data.error.errors) {
						if(data.error.errors.email) {
							root.querySelector("#loginForm #email .error").innerHTML = data.error.errors.email.message;
						}
						if(data.error.errors.password) {
							root.querySelector("#loginForm #password .error").innerHTML = data.error.errors.password.message;
						}
					}
				} else {
					root.querySelector("#loginForm #form").innerHTML = data.error.message;
				}
			} else {//loggedIn===true => redirect to users/:id
				let user = data.user;
				//redirect
				location.hash = '#/users/' + user.id;
				//refresh links
				utils.refreshUser(user);
				sideMenuService.hide();
			}
		});
	}
	
	//attach function to button
	loginBtn.addEventListener("click", login, false);
	
	//input oninput => clear form errors
	root.querySelectorAll("#loginForm input").forEach( input => {
			input.addEventListener("input", e => {
				if(e.currentTarget.type!=='checkbox') {
					root.querySelector("#loginForm #" + e.currentTarget.name + " .error").innerHTML = '';
					root.querySelector("#loginForm #form").innerHTML = '';
				}
			}, false);
	});
	
	//go to register
	root.querySelector("#forgot_password").addEventListener('click', e => {
		utils.getFragment('/fragments/forgot_password/forgot_password.html', sideMenuService.container, forgot_password)
		.then( controller => { controller(); });
	}, false);
	
	//go forgot_password
	root.querySelector("#register").addEventListener('click', e => {
		utils.getFragment('/fragments/register/register.html', sideMenuService.container, register)
		.then( controller => { controller(); });
	}, false);
	
};

