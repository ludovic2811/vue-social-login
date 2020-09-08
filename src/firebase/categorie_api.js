import firebase from "@/firebase/firebase_api"; 
const const_categorie = {
	json_categorie : {
		nom: '',
		icon: '',
		types:[]
	},
	json_type: {
		nom: "",
		prix: ""
	},
	/*
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
	},*/
	save (dataAgence, categorie, fct) {
		// probablement qu'on va devoir mettre en place les calculs ici ou pas
		dataAgence.categories[categorie.id] = categorie;
		console.log(dataAgence.categories)
		firebase.api.getDb().collection("agence").doc(dataAgence.id).update({
			categories: dataAgence.categories
		}).then(()=>{fct()});
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

