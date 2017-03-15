//password_reset.js
const password_reset = function() {
	'use strict';

	//rootElement
	let root = document.querySelector("#password_reset.content");
	let container = document.querySelector("#container");
	
	let password_reset = () => {
		let info = {};
		let token = location.hash.replace(/#\/users\/password_reset\//,'');
		token = token.replace(/\/edit.+/,'');
		let email = location.hash.replace(/#\/users\/password_reset\/.+\/edit\?email=/,'');
		let password = root.querySelector("#passwordResetForm input[name=password]").value;
		let password_confirm = root.querySelector("#passwordResetForm input[name=password_confirm]").value;
		info.token = token;
		info.email = email;
		info.password = password;
		info.password_confirm = password_confirm;
		var options = { url: '/users/password_reset/edit', method: 'PUT', data: JSON.stringify(info) };
		utils.ajax(options).then( response => {
			let data = JSON.parse(response);
			if(!data.reset) {//reset===false => display errors
				if(data.error.name==='ValidationError') {
					if(data.error.errors) {
						if(data.error.errors.password) {
							root.querySelector("#passwordResetForm #password .error").innerHTML = data.error.errors.password.message;
						}
						if(data.error.errors.password_confirm) {
							root.querySelector("#passwordResetForm #password_confirm .error").innerHTML = data.error.errors.password_confirm.message;
						}
					}
				} else {
					if(data.error.message) {
						root.querySelector("#passwordResetForm #form.error").innerHTML = data.error.message;
					}
				}
			} else {
				utils.getFragment('/fragments/password_reset_success/password_reset_success.html', container, password_reset_success)
				.then( controller => { controller(data.message); });
			}
		});
	}
	
	//attach forgot_password to button
	root.querySelector("#resetButton").addEventListener('click', password_reset, false);
	
	//input oninput => clear form errors
	root.querySelectorAll("#passwordResetForm input").forEach( input => {
			input.addEventListener("input", e => {
				root.querySelector("#passwordResetForm #" + e.currentTarget.name + " .error").innerHTML = '';
				root.querySelector("#passwordResetForm #form").innerHTML = '';
			});
	});
}
