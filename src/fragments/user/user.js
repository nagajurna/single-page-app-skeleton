//user.js
const user = function(id) {
	'use strict';
	
	//root element
	let root = document.querySelector("#user.content")
	
	let options = { method: 'GET', url: '/users/users/' + id }
	utils.ajax(options).then( response => {
		let data = JSON.parse(response);
		let user = data.user;
		root.querySelector('#name').innerHTML = user.name;
	});
		
		

};


