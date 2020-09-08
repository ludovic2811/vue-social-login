import firebase from "@/firebase/firebase_api"; 
import conso from "@/firebase/client_consolidation"; 
const const_article = {
	json_article: {
		numero: "",
		idCategorie: 0,
		idType: 0,
		prix: 0,
		idEntrepot: 0,
		idStock: 0,
		partirle: "",
		rentrele: "",
		idEtat: 0,
		paiement: {}
	}
	,
	save(store, client, fct) {
		var request = conso.api.consolidation(store.getters.getAgence, client)
		store.getters.getDocAgence.collection("clients").doc(client[".key"])
		.update({
			articles : client.articles,
			request: request
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