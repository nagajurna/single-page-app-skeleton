const ERR = {
	SERVER: "L\'application a rencontré une erreur, veuillez recommencer plus tard",
	REQUIRED: "Champ obligatoire",
	MAILINVALID: "Adresse invalide",
	PASSMIN: "Mot de passe trop court (6 caractères minimum)",
	NAMEMAX: "Nom trop long(25 caractères maximum)",
	NAMEUNIQUE: "Nom d\'utilisateur déjà utilisé",
	MAILUNIQUE: "Adresse mail déjà enregistrée",
	MAILNOTFOUND: "Adresse introuvable",
	MISMATCH: "Mauvaise combinaison identifiant/mot de passe",
	PASSMISMATCH: "Mot de passe différent",
	NONAUTH: "Votre requête ne peut pas aboutir",
	PASSERR: "Mot de passe erroné",
	TOKENNONVALID: "Ce lien est erroné",
	TOKENEXPIRED: "Ce lien n\'est plus actif (durée : 2 heures)",
	RESETALREADYLOGGED: "Vous êtes déjà connecté. Votre requête ne peut pas aboutir."
}

module.exports = ERR;
