//side-menu.js
const sideMenuService = (function() {
	'use strict';
	
	let sideMenu = {};
	
	sideMenu.openBtn = document.querySelector('#side-menu-open');
	
	sideMenu.closeBtn = document.querySelector('#side-menu-close');
	
	sideMenu.menu = document.querySelector('#side-menu');
	
	sideMenu.container = document.querySelector('#side-menu-container');
	
	
	sideMenu.hide = e => {
		if(e) { e.preventDefault(); }
		utils.getFragment('/fragments/user_profile/user_profile_blank.html', sideMenu.container, null)
		sideMenu.menu.className = '';
		document.body.className = '';
	}
	
	sideMenu.show = e => {
		if(e) { e.preventDefault(); }
		sideMenu.Default();
		sideMenu.menu.className = 'show';
		document.body.className = 'fixed';
	}
	
	sideMenu.Default = () => {
		utils.getId()
		.then( id => {
			utils.getFragment('/fragments/user_profile/user_profile.html', sideMenu.container, user_profile)
			.then( controller => { controller(id); });
			}, error => {
				utils.getFragment('/fragments/login/login.html', sideMenu.container, login)
				.then( controller => { controller(); });
			});
	}
	
	sideMenu.openBtn.addEventListener('click', sideMenu.show, false);
	sideMenu.closeBtn.addEventListener('click', sideMenu.hide, false);
	
	
	return sideMenu;
	
})();
