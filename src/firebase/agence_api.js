import firebase from "@/firebase/firebase_api"; 
import user from "@/firebase/user_api"; 

const const_agence = {
	json: {
		nom: "",
		roles: {},
		abonnement: "BABY",
		id: -1,
		finish: 0
	},
	abonner(store, abonnement) {
		store.getters.getDocAgence.update({
			abonnement: abonnement
		})
	},
	updateFinish(store, finish, fct) {
		
		store.getters.getDocAgence.update({
			finish: finish
		}).then(()=>{
			fct()
		})
	},
	addSubCollection(docAgence, collectionAdd, fct) {
		docAgence.collection(collectionAdd).get().then(querySnapshot=>{

				var docs = querySnapshot.docs.map(function (doc) {
					    const eventData = doc.data()
	    				eventData.id = doc.id
	    				return eventData
					});
				fct(docs)				
		});
	},
	initCollections(agence, fct) {
		var docAgence = firebase.api.getDb().collection("agence").doc(agence.id);	
		this.addSubCollection(docAgence, "etats", etats=> {
			agence['etats'] = etats;
			this.addSubCollection(docAgence, "categories", categories=>{
				agence['categories'] = categories;
				this.addSubCollection(docAgence, "entrepots", entrepots=>{
					agence['entrepots'] = entrepots;
					fct(agence);
				});
			});			
		});
	},
	save (store, agence, fct) {
		if (agence.id == -1) {
			var uid = firebase.api.getUser().uid;
			agence.roles[uid] = "write";
			firebase.api.getDb().collection("agence").add(agence).then(function(docRef) {
				agence.id = docRef.id;
				user.api.addAgence(store, docRef.id, fct);		    
			})
			.catch(function(error) {
			    console.error("Error adding document: ", error);
			});
		}
		else {
			firebase.api.getDb().collection("agence").doc(agence.id).update({
				nom: agence.nom
			}).then(()=>{
				fct();
			})
		}
	},
	getAll(store, fct) {
		var currentUser = store.getters.getUser;	
		currentUser.agences.forEach(idAgence=>{				
				firebase.api.getDb().collection("agence").doc(idAgence).get().then(querysnapshot=>{
					var agenceData = querysnapshot.data();
					agenceData['id'] = idAgence;
					fct(agenceData);					
				}).catch(error=>{
					// TODO  : A SUPRIMER OU DEMANDER LA SUPPRESSION
				})	
		})
	},
	saveTypePaiement(store, typePaiements, fct) {
		var currentAgence = store.getters.getAgence;
		var docAgence = store.getters.getDocAgence;		
		if (typeof(currentAgence.typePaiements) != "undefined") {
			currentAgence.typePaiements = typePaiements;
		}
		else
			currentAgence["typePaiements"] = typePaiements;
		docAgence.update(currentAgence).then(()=>{
			fct();
		});		
	},
	AddTypePaiement(store,  typePaiement, fct) {
		var currentAgence = store.getters.getAgence;
		var docAgence = store.getters.getDocAgence;
		if (typeof(currentAgence.typePaiements) != "undefined") {
			currentAgence.typePaiements.push (typePaiement);
		}
		else {
			currentAgence["typePaiements"] = [];
			currentAgence["typePaiements"].push(typePaiement);
		}

		docAgence.update(currentAgence).then(()=>{
			fct();
		});
	}
	


}

export default {
	api: const_agence
}