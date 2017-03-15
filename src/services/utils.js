//utils.js
const utils = {
	//AJAX requests
	ajax: options => {
		'use strict';
		let promise = new Promise( (resolve,reject) => {
			let method = options.method;
			let url = options.url;
			let data = options.data;
			let xmlhttp = new XMLHttpRequest();
			xmlhttp.onreadystatechange = () => {
				if(xmlhttp.readyState===4) {
					if(xmlhttp.status===200) {
						resolve(xmlhttp.responseText);
					} else {
						reject(Error(xmlhttp.statusText));
					}
				}
			}
			
			xmlhttp.open(method,url,true);
			xmlhttp.setRequestHeader("Content-type", "application/json");
			if(data) {
				xmlhttp.send(data);
			} else {
				xmlhttp.send();
			}
		});
		
		return promise;
	},
		
	//get HTML fragment, container, controller	
	getFragment: (template, container, controller) => {
		'use strict';
		let options = { method: 'GET', url: template }
		return utils.ajax(options).then( response => {
			return new Promise( (resolve) => {
				container.innerHTML = response;
				resolve(controller);
			});
		});
	},
				
	//check role admin			
	checkRole: () => {
		'use strict';
		let options = {method: 'GET', url: '/users/currentuser' }
		return utils.ajax(options).then( response => {
			let data = JSON.parse(response);
			let user = data.user;
			return new Promise( (resolve, reject) => {
				if(user && user.admin===true) {
					resolve(user.admin);
				} else {
					reject('error');
				}
			});
		});
	},
	
	//check user id			
	checkId: reqId => {
		'use strict';
		let id = reqId;
		let options = {method: 'GET', url: '/users/currentuser' }
		return utils.ajax(options).then( response => {
			let data = JSON.parse(response);
			let user = data.user;
			return new Promise( (resolve, reject) => {
				if(user && user.id===id) {
					resolve(user.id);
				} else {
					reject('error');
				}
			});
		});
	},
	
	//get user id			
	getId: () => {
		'use strict';
		let options = {method: 'GET', url: '/users/currentuser' }
		return utils.ajax(options).then( response => {
			let data = JSON.parse(response);
			let user = data.user;
			return new Promise( (resolve, reject) => {
				if(user && user.id) {
					resolve(user.id);
				} else {
					reject('error');
				}
			});
		});
	},
	
	//when register/login/logout/reload : refresh nav menu links (register, login, logout, profil) 
	refreshUser: user => {
		'use strict';
		let root = document.querySelector("nav");
		if(user) {
			root.querySelector("#admin").className = (user.admin ? 'on' : '');
			sideMenuService.openBtn.innerHTML = user.name;
			
		} else {
			root.querySelector("#admin").className = '';
			sideMenuService.openBtn.innerHTML = 'Connexion';
		}
	},
	
	//active link : change class
	activeLink: () => {
		'use strict';
		let root = document.querySelector("nav");
		let links = root.querySelectorAll("a");
		for(let i=0; i<links.length; i++) {
			if(location.href===links[i].href) {
				links[i].className = "clicked";
			} else {
				links[i].className = ""; 
			}
			
			if(location.hash.match(/#\/admin/)) {
				if(links[i].href.match(/#\/admin/)) {
					links[i].className = "clicked";
				} else {
					links[i].className = ""; 
				}
			}
		}
		if(location.hash.match(/#\/users\/.+[^\/]$/)) {
			sideMenuService.openBtn.className='clicked';
		} else {
			sideMenuService.openBtn.className='';
		}
	}
}
