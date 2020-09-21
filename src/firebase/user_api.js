import firebase_api from "@/firebase/firebase_api"; 


const const_user = {
	json : {
		displayName: '',
		email: '',
		photoURL: '',	
		agences: [],
		login: false,
		idAgenceSelected: null,
		userCreated: "-1",
		userNew: ""
	},
	currentUser : null,
	docRef: null,
	getUser(idUser, fct) {
		firebase_api.api.getDb().collection("user").doc(idUser).get().then(doc=>{
			if (doc.exists) {
				fct(doc.data())
			}
			else
				fct("");
		})
	},
	setAgenceSelected(doc, idAgence, fct) {		
		doc.update({
			idAgenceSelected: idAgence
		}).then(()=>{
			
			fct();
		})
	},
	deleteAgence(currentIdUser, currentAgence, docAgence, idUser, fct) {

		var roles = currentAgence.roles;
		
		delete roles[idUser];
		docAgence.update({
			roles: roles
		}).then(()=> {		
			// ICI on teste si l'utlisateur sélectionné a été crée par l'utilisateur courant
			// auquel cas si il n'y a qu'une agence : on peut le supprimer
			// sinon on supprime de ses agences l'agence actuelle
			// après si il y a une erreur sur le get c'est qu'il n'a pas les droits car ce n'est pas le créateur
			firebase_api.api.getDb().collection("user").doc(idUser).get().then(doc=>{
				var user = doc.data();
				if (user.userCreated == currentIdUser) {
					if (!user.login) {
						var key, count = 0;
						for(key in user.agences) {
							if(user.agences.hasOwnProperty(key)) {
								count++;
							}
						}
						 
						if (count== 1) {
							firebase_api.api.getDb().collection("user").doc(idUser).delete().then(()=>{
								fct();
							}).catch(()=>{
									console.log("EERROR");
									fct("error")
							})
						}
						else {
							var agences = user.agences;
							var indexAgence = agences.indexOf(currentAgence.id);
							agences.splices(indexAgence, 1);
							firebase_api.getDb().collection("user").doc(idUser).update({
								agences : agences
							}).then(()=>{
								fct();
							}).catch(()=>{
								console.log("EERROR");
								fct("error")
							})
						}
					}
				}
			}).then(()=>{
				fct()
			})
			/*
			.catch(()=>{
				console.log("EERROR");
				fct("error")
			})
			*/
			
		});
	},
	getUsersByAgence(dataAgence, users) {		
		for (var role in dataAgence.roles) {			
			firebase_api.api.getDb().collection("user").doc(role).get().then(user=>{	
				var userData = user.data();
				userData["id"] = user.id;			
				users.push(userData);
			});

			
		}		
	},
	confirm (currentAgence, docAgence, userASupprimer, fct) {

		var idNewUser = userASupprimer.userNew;
		delete currentAgence.roles[userASupprimer.id];
		currentAgence.roles[idNewUser] = "write";
		docAgence.update({
			roles: currentAgence.roles
		}).then(()=>{
			firebase_api.api.getDb().collection("user").doc(userASupprimer.id).delete().then(()=>{
				fct();
			});
		})
	},
	createWithoutAuth(idUser, currentAgence, docAgence, displayName, email, fct) {
		var findUser = false;
		var docRef = firebase_api.api.getDb().collection("user");
		docRef.where("email", "==", email).get().then(querySnapshot=> {
			if (querySnapshot.exists) {
				querySnapshot.docs.forEach(doc=>{
					var userData = doc.data();
					// le login est faux et que c'est moi qui déjà crée cet utilisateur 
					// alors j'ajoute l'agence dans celle existante
					if ((!userData.login) && (userData.userCreated == idUser)) {
						findUser = true;
						var agences = userData.agences; 
						if (agences.indexOf(currentAgence.id)==-1) {
							agences.push(currentAgence.id);
							firebase_api.api.collection("user").doc(doc.id).update({
								agences: agences
							});
							var roles = currentAgence.roles;
							roles[doc.id] = "write";
							docAgence.update({
								roles: roles
							})
						}
					}
				});
			}
		})
		if (!findUser)	{
			var agences = []
			agences.push(currentAgence.id);
			firebase_api.api.getDb().collection("user").add({
						displayName: displayName,
						email: email,
						photoURL: "",
						login: false,
						agences: agences,
						userCreated: idUser,
						idAgenceSelected: null,
						userNew: null
					}).then(addUserData=>{
						var roles = currentAgence.roles;
						roles[addUserData.id] = "write";
						docAgence.update({
							roles: roles
						}).then(()=>{
							fct();
						})
					});
				}
	}
	,
	addAgence(store, idAgence, fct) {
		
		var listAgences = store.getters.getUser.agences;
		var indexAgence = listAgences.indexOf(idAgence);
		if (indexAgence == -1) {
			listAgences.push(idAgence);
			firebase_api.api.getDb().collection("user").doc(store.getters.getUser.id).update ({
				agences : listAgences
			}).then(()=>{
				fct();
			});	
		}
	},
		
	createWidthAuth (fct) {
		var userAuth = firebase_api.api.getUser();
		var docRef = firebase_api.api.getDb().collection("user");
		var idAgenceSelected = "";
		var docRef = docRef.where("email", "==", userAuth.email);
		var agencesCopy = [];
		docRef.get().then(querySnapshot=> {

			querySnapshot.docs.forEach(doc=>{
				var idUserfind = doc.id;

				if (idUserfind == userAuth.uid) {
					idAgenceSelected = doc.data().idAgenceSelected;
					agencesCopy = doc.data().agences;
				}
				else {
					var agences = doc.data().agences;
					agences.forEach(idAgence=>{
						if (agencesCopy.indexOf(idAgence)==-1)
							agencesCopy.push(idAgence);
					});

					firebase_api.api.getDb().collection("user").doc(idUserfind).update({
						userNew: userAuth.uid
					});
				}

				//login = doc.data().login;
					
			})
			
			
			firebase_api.api.getDb().collection("user").doc(userAuth.uid).set ({
					displayName: userAuth.displayName,
					email: userAuth.email,
					photoURL: userAuth.photoURL,
					login: true,
					agences: agencesCopy,
					idAgenceSelected: idAgenceSelected,
					userNew: ""
			}).then(querySnapshot=>{
				fct();
			}).catch(function (error) {
				console.log("Error set User : "+error);
			});
			
		});
	}
		
}



export default {
  api: const_user
};