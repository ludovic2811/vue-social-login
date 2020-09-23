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
		typePaiements: {},
		nbClients: 0,
		nbArticles: 0,
		userIdCreated: null
	},
	incNbClient (store, fct) {
		if (typeof(store.getters.getAgence.nbClients)=="undefined")
			store.getters.getAgence.nbClients=0;
		store.getters.getAgence.nbClients++;
		store.getters.getDocAgence.update({
			nbClients: store.getters.getAgence.nbClients
		}).then(()=>{
			fct();
		})
	},
	decNbClient (store, fct) {
		store.getters.getAgence.nbClients--;
		store.getters.getDocAgence.update({
			nbClients: store.getters.getAgence.nbClients
		}).then(()=>{
			fct();
		})
	},
	delete(store, agence, fct) {
		if (store.getters.getUser.idAgenceSelected == agence.id) {
			firebase.api.getDb().collection("user").doc(store.getters.getUser.id).get().then(user=>{
				user.ref.update({
					idAgenceSelected : ""
				})
			})
		}
		firebase.api.getDb().collection("agence").doc(agence.id).delete().then(()=>{
			fct();
		});
	},
	save (store, agence, fct) {
		if (agence.id == -1) {
			var uid = firebase.api.getUser().uid;
			agence.roles[uid] = "write";
			agence.userIdCreated = store.getters.getUser.id;
			//Ajouter si son abonnement le permet
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
	},
	getAll(store, fct) {
		var currentUser = store.getters.getUser;
		if ((currentUser) != null)
		if (typeof(currentUser.agences)!="undefined") {
			currentUser.agences.forEach(idAgence=>{				
					firebase.api.getDb().collection("agence").doc(idAgence).get().then(querysnapshot=>{
						var agenceData = querysnapshot.data();
						agenceData['id'] = idAgence;
						fct(agenceData);					
					}).catch(error=>{
						// TODO  : A SUPRIMER OU DEMANDER LA SUPPRESSION
					})	
			})
		}
	},
	saveTypePaiement(agence, fct) {
		firebase.api.getDb().collection("agence").doc(agence.id).update({
			typePaiements: agence.typePaiements
		}).then(()=>{
			fct();
		});		
	},
	get(agence, fct) {
		firebase.api.getDb().collection("agence").doc(agence.id).get().then(agenceDoc=>{
			var agenceData=agenceDoc.data();
			agenceData.id = agenceDoc.id;
			fct(agenceData);
		})
	}
	


}

export default {
	api: const_agence
}