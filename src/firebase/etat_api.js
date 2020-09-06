import firebase from "@/firebase/firebase_api"; 
const const_etat = {
	json_etat : {
		nom: '',
		icon: '',
		sorti: false
	},
	save(docAgence, etat, fct) {
		if (typeof(etat.id) == "undefined") {
			
			docAgence.collection("etats").doc().set(etat).then(()=>{
					fct();
				})
		}
		else {
			var docRef = docAgence.collection("etats").doc(etat.id);
			docRef.get().then(querySnapshot=>{
				if (querySnapshot.exists) {
					docRef.update(etat).then(docRef=>{
						fct();
					})
				}			
			})
		}
	},
	getAllEtats(docAgence, fct) {
			var docRef = docAgence.collection('etats');
			docRef.get().then(querySnapshot=>{
				var docs = querySnapshot.docs.map(function (doc) {
					    const eventData = doc.data()
	    				eventData.id = doc.id
	    				return eventData
					})			
    			fct(docs);
			})
	},
	delete(docAgence, idEtat, fct) {
		docAgence.collection("etats").doc(idEtat).delete().then(()=>{
			fct()
		});
	}
	

}

export default {
	api: const_etat
}

