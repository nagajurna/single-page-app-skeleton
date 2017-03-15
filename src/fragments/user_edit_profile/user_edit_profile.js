//user_edit_profile.js
const user_edit_profile = function(id) {
	'use strict';
	
	let root = document.querySelector("#user_edit_profile.side-content")
	//container
	let sideMenu = sideMenuService.container;
	
	//UPDATE PROFILE
	let updateProfile = () => {
		//clear form errors
		root.querySelectorAll("#updateForm .error").forEach( element => {
			element.innerHTML = '';
		});
		//get user values from form
		let user = {};
		user.name = root.querySelector("#updateForm input[name=name]").value;
		user.email = root.querySelector("#updateForm input[name=email]").value;
		user.password = root.querySelector("#updateForm input[name=password]").value;
		//ajax POST
		let options = { url: '/users/users/' + id, method: 'PUT', data: JSON.stringify(user) }
		utils.ajax(options)
		.then( response => {
			let data = JSON.parse(response);
			if(!data.updated) {//updated===false => display errors
				if(data.error.name==='ValidationError') {
					if(data.error.errors) {
						if(data.error.errors.name) {
							root.querySelector("#updateForm #name .error").innerHTML = data.error.errors.name.message;
						}
						if(data.error.errors.email) {
							root.querySelector("#updateForm #email .error").innerHTML = data.error.errors.email.message;
						}
						if(data.error.errors.password) {
							root.querySelector("#updateForm #password .error").innerHTML = data.error.errors.password.message;
						}
					}
				} else {
					root.querySelector("#updateForm #form").innerHTML = data.error.message;
				}
			} else {//updated===true => redirect to users/:id
				let user = data.user;
				//redirect
				if(location.hash === '#/users/' + user.id) {
					location.hash = '#/';//force hashchange
					location.hash = '#/users/' + user.id;
				} else {
					location.hash = '#/users/' + user.id;
				}
				//refresh links
				utils.refreshUser(user);
				sideMenuService.hide();
			}
		});
	};
	
	//get user info
	let options = { method: 'GET', url: '/users/users/' + id };
	utils.ajax(options)//user info
	.then( response => {//fill DOM with user info
			let data = JSON.parse(response);
			let user = data.user;
			root.querySelector("#updateForm input[name=name]").value = user.name;
			root.querySelector("#updateForm input[name=email]").value = user.email;
			root.querySelector("#updateForm input[name=password]").value = '';
			return new Promise( (resolve,reject) => {
				resolve(user);
			});
	})
	.then( user => {//add listener
		//update profile button
		root.querySelector("#updateButton").addEventListener("click", updateProfile, false);
		//input oninput => clear form errors
		root.querySelectorAll("#updateForm input").forEach( input => {
			input.addEventListener("input", e => {
				root.querySelector("#updateForm #" + e.currentTarget.name + " .error").innerHTML = '';
				root.querySelector("#updateForm #form").innerHTML = '';
			}, false);
		});	
	});
	
	
	//GET UPDATE PASSWORD
	let getUpdatePassword = e => {
		e.preventDefault();
		//get fragment
		utils.getFragment('/fragments/user_edit_password/user_edit_password.html', sideMenu, user_edit_password)
		.then( controller => { controller(id); });
	};
	
	//GET PROFILE
	let getProfile = e => {
		e.preventDefault();
		//get fragment
		utils.checkId(id)
		.then( sessId => {
			return utils.getFragment('/fragments/user_profile/user_profile.html', sideMenu, user_profile)
		})
		.then( controller => { controller(id); })
		.catch( error => { location.hash = '#/'; });
	};
	
	//attach getUpdatePassword to button
	root.querySelector("#editPassword").addEventListener("click", getUpdatePassword, false);
	//attach getProfile to button
	root.querySelector("#profile").addEventListener('click', getProfile, false);
}
