//password_reset_success.js
const password_reset_success = function(message) {
	'use strict';

	//rootElement
	let root = document.querySelector("#password_reset_success.content");
	
	root.querySelector("#success").innerHTML = message;
	
}
