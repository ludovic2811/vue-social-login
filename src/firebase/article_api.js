import conso from "@/firebase/client_consolidation"; 
import inout_api from "@/firebase/inout_api"; 
import util from "@/firebase/util"; 
const const_article = {
	json_article: {
		numero: "",
		complement: "",
		idCategorie: 0,
		idType: 0,
		prix: 0,
		idEntrepot: 0,
		idStock: 0,
		departLe: "",
		rentreLe: "",
		idEtat: 0,
		paiement: {},
		id: ""
	},
	delete (store, client, article) {
		inout_api.api.deleteByArticle(store, article);
		delete client.articles[article.id];
	}
	,
	set(store, client, fct) {
		console.log(client);
		var request = conso.api.consolidation(store.getters.getAgence, client)
		store.getters.getDocAgence.collection("clients").doc(client[".key"])
		.update({
			articles : client.articles,
			request: request
		}).then(()=>{			
			fct();
		})
		.catch(error=>{
			console.log(error)
		})
	},
	save(store, client, articleModif, articleDelete, fct) {
		var articleOld;
		
		if (typeof(articleDelete) != "undefined") {
			articleOld = articleDelete;
		}
		else {
			articleOld = client.articles[articleModif.id];
			if (typeof(articleOld) == "undefined") {
				
				articleModif.id =  util.util.uuid();
				
			}
		}
		
		conso.api.calculEspaceEntrepot (store.getters.getAgence, articleModif, articleOld, (modif)=>{
			if (typeof(articleModif) != "undefined")
				client.articles[articleModif.id] = articleModif;
			this.set(store, client,()=>{
				/*
				if (newArticle) {
					etat_api.api.incNbArticle(store,articleModif);
					//agence_api.api.incNbArticle(store);
					fct();					
				}
				else if (deleteArticle) {
					etat_api.api.decNbArticle(store, articleOld);
					//agence_api.api.decNbArticle(store);
					fct();
				}
				else {
					etat_api.api.incNbArticle(store,articleModif);
					etat_api.api.decNbArticle(store, articleOld);
					fct();
				}*/
				fct();
			});

		});
		
		
	}	
	
}

export default {
	api: const_article
}