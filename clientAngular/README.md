PROJET CL_IHM

Deux dossiers sont à disposition :
	- Le client
	- Le serveur

Installation :
	npm install dans les deux dossiers.

Utilisation :
	npm run start dans les deux dossiers.
	Pour accéder à l'application, ouvrir un navigateur web à l'adresse http://localhost:4200
	
	Vous devez vous connecter avec un compte infirmier ou un compte secrétaire (admin).
	Les logs sont dans le fichier data/login.json :
		- pour un infirmier nom + première lettre du prénom et default comme mdp
		- pour le sécretaire, admin et admin comme mdp
		
Implémentation :
	
	Pour le client :
	3 pages sont disponibles :
		- la page de login
		- la page d'infirmier
		- la page de sécretaire
	Pour cela, nous avons décidé d'utiliser le routing que propose angular ( https://angular.io/guide/router )
	
	L'ajout et la modification de patients est possible ainsi que leurs suppressions.
	L'affectation et desaffectation avec du drag&drop est possible.
	
	Pour la modification et l'ajout, nous avons décidé d'utiliser les dialogs box de matérial.
	Chaque champ de la dialog box doit répondre à certaines conditions ( required et/ou une regex ).
	
	Pour le serveur :
		Nous avons créé un utils.ts qui regroupe des fonctions.
		Nous avons au total 6 routes :
			- "/data" --> Aucun changements.
			- "/addPatient"  --> Sert UNIQUEMENT à l'ajout de patients
			- "/affectation" --> Aucuns changements.
			- "/removePatient" --> Permet de supprimer un patient
			- "/updatePatient" --> Permet d'update un patient
			- "/loginRequest" --> Envoie une demande de connexion et renvoie des informations (renvoie une erreur si rejeté)
		
		Si le traitement d'une requête échoue (impossible de supprimer un patient / update / affecter etc ...), un code d'erreur 500 (403 pour le login) sera envoyé
		
		
	
	
