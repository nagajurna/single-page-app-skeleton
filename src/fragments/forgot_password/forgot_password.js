//forgot_password.js
const forgot_password = function() {
	'use strict';
	
	//rootElement
	let root = document.querySelector("#forgot_password.side-content");
	
	let forgot_password = () => {
		//clear form errors
		root.querySelectorAll("#forgotPasswordForm .error").forEach( element => {
			element.innerHTML = '';
		});
		let info = {};
		let email = root.querySelector("#forgotPasswordForm input[name=email]").value;
		info.email = email;
		var options = { url: '/users/password_reset/', method: 'POST', data: JSON.stringify(info) };
		utils.ajax(options).then( response => {
			let data = JSON.parse(response);
			if(!data.emailSent) {//email===false => display errors
				if(data.error.name==='ValidationError') {
					if(data.error.errors) {
						if(data.error.errors.email) {
							root.querySelector("#forgotPasswordForm #email .error").innerHTML = data.error.errors.email.message;
						}
					}
				} else {
					if(data.error.message) {
						root.querySelector("#forgotPasswordForm #form.error").innerHTML = data.error.message;
					}
				}
			} else {
				utils.getFragment('/fragments/forgot_password_mail_sent/forgot_password_mail_sent.html', sideMenuService.container, forgot_password_mail_sent)
				.then( controller => { controller(data.email); });
			}
		});
	}
	
	//attach forgot_password to button
	root.querySelector("#forgot_passwordButton").addEventListener('click', forgot_password, false);
	
	//GET login
	let getLogin = e => {
		e.preventDefault();
		//get fragment
		utils.getFragment('/fragments/login/login.html', sideMenuService.container, login)
		.then( controller => { controller(); });
	};
	
	//attach getLogin to button
	root.querySelector("#login").addEventListener('click', getLogin, false);
	
	//input oninput => clear form errors
	root.querySelector("#forgot_password input").addEventListener("input", e => {
		root.querySelector("#forgot_password #" + e.currentTarget.name + " .error").innerHTML = '';
	}, false);
	
}
