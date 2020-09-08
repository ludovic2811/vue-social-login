import firebase from "@/firebase/firebase_api"; 
const const_article = {
	json_article: {
		numero: "",
		idCategorie: 0,
		indexType: 0,
		prix: 0,
		idEntrepot: 0,
		indexStock: 0,
		partirle: "",
		rentrele: "",
		indexEtat: 0,
		paiement: {}
	}
	,
	save(store, client, fct) {
		
		store.getters.getDocAgence.collection("clients").doc(this.client[".key"])
		.update({
			articles : this.client.articles
		}).then(()=>{
			console.log("ALORS ?")
			fct();
		})
		.catch(error=>{
			console.log(error)
		})
	}	
	
}

export default {
	api: const_article
}