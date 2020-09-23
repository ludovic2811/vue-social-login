import firebase from "@/firebase/firebase_api"; 
import conso from "@/firebase/client_consolidation"; 
const const_categorie = {
	json_categorie : {
		id: '',
		nom: '',
		icon: '',
		types:{},
		nbArticles: 0
	},
	json_type: {
		id: '',
		nom: "",
		prix: "",
		nbArticles: 0
	},
	save (dataAgence, categorie, fct) {
		
		dataAgence.categories[categorie.id] = categorie;
		conso.api.resetCalculEntrepot(dataAgence.entrepots, dataAgence.categories, ()=>{
			
			firebase.api.getDb().collection("agence").doc(dataAgence.id).update({
				categories: dataAgence.categories,
				entrepots: dataAgence.entrepots
			}).then(()=>{fct()});
		})
		
	},
	delete (dataAgence, categorie, fct) {
		delete dataAgence.categories[categorie.id];
		firebase.api.getDb().collection("agence").doc(dataAgence.id).update({
			categories: dataAgence.categories
		}).then(()=>{fct()});
	},
	getAllCategories(docAgence, fct) {
			var docRef = docAgence.collection('categories');
			docRef.get().then(querySnapshot=>{
				var docs = querySnapshot.docs.map(function (doc) {
					    const eventData = doc.data()
	    				eventData.id = doc.id
	    				return eventData
					})			
    			fct(docs);
			})
	}
	

}

export default {
	api: const_categorie
}

