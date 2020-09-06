import firebase from "@/firebase/firebase_api"; 

const const_entrepot = {
	store: null,
	json: {
		id: "0",
		nom: '',
		stocks: []
	},
	json_stock: {
		nom: '',
		capacite: 0,
		fige: false
	},
	
	addOrUpdate (docAgence, entrepot, fct) {
		console.log(entrepot);
		var docRef = docAgence.collection('entrepots').doc(entrepot.id);
		docRef.get().then(querySnapshot => {
			if (!querySnapshot.exists)  {
				docAgence.collection('entrepots').add({
					nom: entrepot.nom,					
					stocks: entrepot.stocks
				}).then(entrepot => {
					fct(entrepot);
				});
			}
			else {
				console.log("UPDATE");
				console.log(entrepot.nom);
				docRef.update ({
					nom: entrepot.nom,					
					stocks: entrepot.stocks
				}).then (()=>{fct()})
			}
		});		
	},
	getAll(docAgence, fct) {		
		docAgence.collection('entrepots').get().then(querySnapshot=> {
    		var docs = querySnapshot.docs.map(function (doc) {
					    const eventData = doc.data()
	    				eventData.id = doc.id
	    				return eventData
					})			
    		fct(docs);
    	})
	},
	delete(store, idEntrepot, fct) {
		store.getters.getDocAgence.collection('entrepots').doc(idEntrepot).delete().then(()=>{
			fct();
		})
	}
}


export default {
	api: const_entrepot
}