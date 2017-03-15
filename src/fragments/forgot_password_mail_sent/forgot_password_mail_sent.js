//forgot_password_mail_sent.js
const forgot_password_mail_sent = function(email) {
	'use strict';
	
	//rootElement
	let root = document.querySelector("#forgot_password_mail_sent.side-content");
	
	root.querySelector('#email').innerHTML = email;
	
}
