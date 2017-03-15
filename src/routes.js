//routes.js
(function() {
	'use strict';
	if(location.hash === "") { location.hash = "#/"; }
	
	let oldhash, newhash;

	window.addEventListener('DOMContentLoaded', () => {
			newhash = location.hash;
			router(oldhash, newhash);
		}, false);

	window.addEventListener('hashchange', () => {
			oldhash = newhash;
			newhash = location.hash;
			router(oldhash, newhash);
		}, false);


	let router = (oldhash, newhash) => {
		
		var container = document.querySelector('#container');
		
		//ROUTES
		if(newhash === '#/') {
			//HOME
			utils.getFragment('/fragments/home/home.html', container, home)
			.then( controller => { controller(); });
		
		} else if(newhash === '#/admin/') {
			//ADMIN
			utils.checkRole()//check that session user is admin
			.then( isAdmin => {
				return utils.getFragment('/fragments/admin/admin.html', container, admin);
			})
			.then( controller => { controller(); })
			.catch( error => {
				location.hash = '#/';
			});
			
		} else if(newhash.match(/#\/admin\/users\/.+[^\/]$/)) {
			//ADMIN/USERS/:ID
			let id = newhash.replace(/#\/admin\/users\//, '');
			utils.checkRole()//check that session user is admin
			.then( isAdmin => {
				return utils.getFragment('/fragments/admin_user/admin_user.html', container, admin_user);
			})
			.then( controller => { controller(id); })
			.catch( error => {
				location.hash = '#/';
			});
		
		} else if(newhash.match(/#\/users\/password_reset\/.+/)) {
			//USERS/PASSWORD_RESET/:TOKEN/EDIT
			utils.getFragment('/fragments/password_reset/password_reset.html', container, password_reset)
			.then( controller => { controller(); });
							
		} else if(newhash.match(/#\/users\/.+[^\/]$/)) {
			//USERS/:ID
			let id = newhash.replace(/#\/users\//, '');
			utils.checkId(id)//check that session user is :ID
			.then( sessId => {
				return utils.getFragment('/fragments/user/user.html', container, user);
			})
			.then( controller => { controller(id); })
			.catch( error => {
				location.hash = '#/';
			});
					
		} else if(newhash === '#/admin/users/') {
			//USERS
			utils.checkRole()//check that session user is admin
			.then( isAdmin => {
				return utils.getFragment('/fragments/users/users.html', container, users)
			})
			.then( controller => { controller(); })
			.catch( error => {
				location.hash = '#/';
			});
		
		} else {
			//FALLBACK
			location.hash = '#/';
		}
		
		//active link
		utils.activeLink();
	};

})();
