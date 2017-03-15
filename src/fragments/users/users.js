//users.js
const users = function() {
	'use strict';
	
	let root = document.querySelector("#users.content");
	
	//get users and display
	let getUsers = () => {
		
		//get users and display them in list item
		var options = { url: '/users/users/', method: 'GET' }
		utils.ajax(options).then( response => {
			var data = JSON.parse(response);
			if(data.error) {
				console.log(data.error);
			} else {
				//clear list container and append list
				let listContainer = root.querySelector("#listContainer");
				if(listContainer.querySelector("ul")) {
					listContainer.removeChild(listContainer.querySelector("ul"));
				} 
				let ul = document.createElement("ul");
				listContainer.appendChild(ul);
				//items
				let users = data.users;
				users.forEach( user => {
					let item = '<p><a href="#/admin/users/' + user._id + '" >' + user.name + '</a></p>'
					let i = document.createElement('li');
					i.innerHTML = item;
					ul.appendChild(i);
				});
			}
		});
	};
	
	//getUsers();
	root.onload = getUsers();
};


