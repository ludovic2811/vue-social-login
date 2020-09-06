import firebase from "@/firebase/firebase_api"; 
const const_categorie = {
	json_categorie : {
		nom: '',
		icon: '',
		types:[]
	},
	json_type: {
		nom: "",
		prix: 0
	},
	save(docAgence, categorie, fct) {
		if (typeof(categorie.id) == "undefined") {
			docAgence.collection("categories").doc().set(categorie).then(()=>{
					fct();
				})
		}
		else {
			var docRef = docAgence.collection("categories").doc(categorie.id);
			docRef.get().then(querySnapshot=>{
				if (querySnapshot.exists) {
					docRef.update(categorie).then(docRef=>{
						fct();
					})
				}			
			})
		}
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
	},
	delete(docAgence, idCategorie, fct) {
		docAgence.collection("categories").doc(idCategorie).delete().then(()=>{
			fct()
		});
	}
	

}

export default {
	api: const_categorie
}

