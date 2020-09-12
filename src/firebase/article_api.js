import firebase from "@/firebase/firebase_api"; 
import conso from "@/firebase/client_consolidation"; 
import inout_api from "@/firebase/inout_api"; 
const const_article = {
	json_article: {
		numero: "",
		idCategorie: 0,
		idType: 0,
		prix: 0,
		idEntrepot: 0,
		idStock: 0,
		departLe: "",
		rentreLe: "",
		idEtat: 0,
		paiement: {}
	},
	delete (store, client, article) {
		inout_api.api.deleteByArticle(store, article);
		delete client.articles[article.numero];
	}
	,
	save(store, client, fct) {
		
		var request = conso.api.consolidation(store.getters.getAgence, client)
		store.getters.getDocAgence.collection("clients").doc(client[".key"])
		.update({
			articles : client.articles,
			request: request
		}).then(client=>{
			console.log("ALORS ?")
			console.log(client)
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