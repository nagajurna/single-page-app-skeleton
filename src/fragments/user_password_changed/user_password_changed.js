//user_password_changed.js
const user_password_changed = function(id) {
	'use strict';
	
	//root element
	let root = document.querySelector("#user_password_changed.side-content");
	//container
	let sideMenu = sideMenuService.container;
	
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
	
	//attach getProfile to button
	root.querySelector("#profile").addEventListener('click', getProfile, false);
	
}
