import firebase from "@/firebase/firebase_api"; 
import user from "@/firebase/user_api"; 

const const_agence = {
	json: {
		nom: "",
		roles: {},
		abonnement: "BABY",
		id: -1,
		finish: 0,
		categories: {},
		entrepots: {},
		etats:{},
		typePaiements: {}
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
			
			firebase.api.getDb().collection("agence").doc(agence.id).set(
				agence
			).then(()=>{
				fct();
			})
		}
	},
	abonner(agence, abonnement) {
		agence.abonnement = abonnement;
		firebase.api.getDb().collection("agence").doc(agence.id).update({
			abonnement: abonnement
		})
	},
	updateFinish(agence) {
		
			firebase.api.getDb().collection("agence").doc(agence.id).update({
				finish: agence.finish
			})
		
		/*
		store.getters.getDocAgence.update({
			finish: finish
		}).then(()=>{
			fct()
		})*/
	},
	/*
	addSubCollection(docAgence, collectionAdd, fct) {
		docAgence.collection(collectionAdd).get().then(querySnapshot=>{

				var docs = querySnapshot.docs.map(function (doc) {
					    const eventData = doc.data()
	    				eventData.id = doc.id
	    				return eventData
					});
				fct(docs)				
		});
	},*/
	/*initCollections(agence, fct) {
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
	*/
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
	saveTypePaiement(agence, fct) {
		firebase.api.getDb().collection("agence").doc(agence.id).update({
			typePaiements: agence.typePaiements
		}).then(()=>{
			fct();
		});		
	}
	


}

export default {
	api: const_agence
}