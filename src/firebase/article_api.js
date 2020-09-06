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
	save(store, idClient, article, fct) {
		
		store.getters.getDocAgence.collection("clients").doc(idClient).collection("articles").doc(article.numero)
		.set(article).then(()=>{
			console.log("ALORS ?")
			fct();
		})
		.catch(error=>{
			console.log(error)
		})
	},
	delete(store, idClient, article, fct) {
		store.getters.getDocAgence.collection("clients").doc(idClient).collection("articles").doc(article.numero)
		.delete().then(()=>{
			console.log("delete");
			fct();
		})
	}
	
}

export default {
	api: const_article
}