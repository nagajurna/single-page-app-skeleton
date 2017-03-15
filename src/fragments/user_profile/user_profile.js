//user_profile.js
const user_profile = function(id) {
	'use strict';
	
	//root element
	var root = document.querySelector("#user_profile.side-content");
	//container
	let sideMenu = sideMenuService.container;
	
	let name = root.querySelector('#name');
	let email = root.querySelector('#email');
	let editProfile = root.querySelector('#editProfile');
	let editPassword = root.querySelector('#editPassword');
	let logout = root.querySelector("#logout");
	//get User
	let options = { method: 'GET', url: '/users/users/' + id };
	utils.ajax(options)
	.then( response => {
		let data = JSON.parse(response);
		let user = data.user;
		name.innerHTML = user.name;
		name.setAttribute('href', '#/users/' + user.id);
		email.innerHTML = user.email;
		
	});
	
	//name on click: hide side-menu
	name.addEventListener('click', () => {
		sideMenuService.hide();
	}, false);
	
	//editProfile on click : get user_edit_profile
	editProfile.addEventListener('click', e => {
		e.preventDefault();
		utils.checkId(id)
		.then( sessId => {
			return utils.getFragment('/fragments/user_edit_profile/user_edit_profile.html', sideMenu, user_edit_profile)
		})
		.then( controller => { controller(id); })
		.catch( error => { location.hash = '#/'; });
	}, false);
	
	//editPassword on click : get user_edit_password
	editPassword.addEventListener('click', e => {
		e.preventDefault();
		utils.getFragment('/fragments/user_edit_password/user_edit_password.html', sideMenu, user_edit_password)
		.then( controller => { controller(id); });
	}, false);
	
	//logout on click : logout, go home, refresh user and hide side-menu
	logout.addEventListener('click', e => {
		e.preventDefault();
		let options = { method: 'GET', url: '/users/logout' };
		utils.ajax(options).then( response => {
			//redirect to Home
			location.hash = "#/";
			//refresh user
			utils.refreshUser(null);
			//hide side-menu
			sideMenuService.hide();
		});
	}, false);
};


