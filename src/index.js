//index.js
(function() {
	'use strict';
	
	//get current user
	window.addEventListener('DOMContentLoaded', () => {
		//currentUser
		let options = { method: 'GET', url: '/users/currentuser' }
		utils.ajax(options).then( response => {
			let data = JSON.parse(response);
			utils.refreshUser(data.user);
			utils.activeLink();
		});
		
		document.querySelector('nav #brand').addEventListener('click', () => {
			sideMenuService.hide();
		}, false);
		
	}, false);
	
	window.addEventListener('scroll', function() {
		if(document.body.scrollTop > 10 || document.querySelector("html").scrollTop > 10) {
			document.querySelector('nav').className = 'scrolled';
		} else {
			document.querySelector('nav').className = '';
		}
	}, false);
	
})();
