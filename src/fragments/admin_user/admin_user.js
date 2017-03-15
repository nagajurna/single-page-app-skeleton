//users.js
const admin_user = function(id) {
	'use strict';
	
	let root = document.querySelector("#admin_user.content");
	
	//get users and display
	let getUser = () => {
		//get user and display
		var options = { url: '/users/users/' + id, method: 'GET' }
		utils.ajax(options).then( response => {
			var data = JSON.parse(response);
			if(data.error) {
				console.log(data.error);
			} else {
				//clear list container and append list
				let userContainer = root.querySelector("#userContainer");
				//user info
				let user = data.user;
				
				let html = '<p>' + user.name + '</p>' +
							'<p>' + user.email + '</p>' +
							'<p>Admin : ' + user.admin + '</p>' +
							'<p>Création : ' + new Date(user.created_at).toLocaleDateString() + '</p>' +
							'<p>Dernière modification : ' + new Date(user.updated_at).toLocaleDateString() + '</p>' +
							'<button id="' + user.id + '" class="suppressButton">Supprimer</button>';
				
				userContainer.innerHTML = html;
					
				//attach event to suppress button
				let suppressButton = root.querySelector(".suppressButton");
				suppressButton.addEventListener("click", suppressUser, false);
			}
		});
	};
	
	//getUsers();
	root.onload = getUser();
	
	//suppressUsers fonction
	let suppressUser = e => {
		let id = e.currentTarget.id;
		let options = { url: '/users/users/' + id, method: 'DELETE' };
		//refresh list
		utils.ajax(options).then( response => {
			location.hash = '#/admin/users/';
		});
	}
};


