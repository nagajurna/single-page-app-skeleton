//user_edit_password.js
const user_edit_password = function(id) {
	'use strict';
	
	//root element
	let root = document.querySelector("#user_edit_password.side-content");
	//container
	let sideMenu = sideMenuService.container;
	
	//UPDATE PASSWORD
	let updatePassword = () => {
		//clear form errors
		root.querySelectorAll("#updateForm .error").forEach( element => {
			element.innerHTML = '';
		});

		//get user values from form
		let user = {};
		user.password = root.querySelector("#updateForm input[name=password]").value;
		user.password_new = root.querySelector("#updateForm input[name=password_new]").value;
		user.password_new_confirm = root.querySelector("#updateForm input[name=password_new_confirm]").value;
		//ajax POST
		let options = { url: '/users/users/password/' + id, method: 'PUT', data: JSON.stringify(user) }
		utils.ajax(options)
		.then( response => {
			let data = JSON.parse(response);
			if(!data.updated) {//updated===false => display errors
				if(data.error.name==='ValidationError') {
					if(data.error.errors) {
						if(data.error.errors.password) {
							root.querySelector("#updateForm #password .error").innerHTML = data.error.errors.password.message;
						}
						if(data.error.errors.password_new) {
							root.querySelector("#updateForm #password_new .error").innerHTML = data.error.errors.password_new.message;
						}
						if(data.error.errors.password_new_confirm) {
							root.querySelector("#updateForm #password_new_confirm .error").innerHTML = data.error.errors.password_new_confirm.message;
						}
					}
				} else {
					root.querySelector("#updateForm #form").innerHTML = data.error.message;
				}
			} else {//updated===true => redirect to users/:id
				let user = data.user;
				//redirect
				utils.getFragment('/fragments/user_password_changed/user_password_changed.html', sideMenu, user_password_changed)
				.then( controller => { controller(id); });
			}
		});
	};
	
	
	//udpatePassword button
	sideMenu.querySelector("#updateButton").addEventListener("click", updatePassword, false);

	//input oninput => clear form errors
	sideMenu.querySelectorAll("#updateForm input").forEach( input => {
		input.addEventListener("input", e => {
			root.querySelector("#updateForm #" + e.currentTarget.name + " .error").innerHTML = '';
			root.querySelector("#updateForm #form").innerHTML = '';
		}, false);
	});
	
	//GET UPDATE PROFILE
	let getUpdateProfile = e => {
		if(e) { e.preventDefault(); }
		//get fragment
		let id;
		utils.getId()
		.then( sessId => {
			id=sessId;
			return utils.getFragment('/fragments/user_edit_profile/user_edit_profile.html', sideMenu, user_edit_profile)
		})
		.then( controller => { controller(id); })
		.catch( error => { location.hash = '#/'; });
	};
	
	//GET PROFILE
	let getProfile = e => {
		e.preventDefault();
		//get fragment
		let id;
		utils.getId()
		.then( sessId => {
			id=sessId;
			return utils.getFragment('/fragments/user_profile/user_profile.html', sideMenu, user_profile)
		})
		.then( controller => { controller(id); })
		.catch( error => { location.hash = '#/'; });
	};
	
	//attach getUpdatePassword to button
	root.querySelector("#editProfile").addEventListener("click", getUpdateProfile, false);
	//attach getProfile to button
	root.querySelector("#profile").addEventListener('click', getProfile, false);
}
