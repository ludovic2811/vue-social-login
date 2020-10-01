import firebase from "@/firebase/firebase_api"; 
const const_etat = {
	json_etat : {
		nom: '',
		icon: '',
		nbArticles: 0,
		out: false
	},
	save(agence, fct) {
		firebase.api.getDb().collection("agence").doc(agence.id).update({
			etats : agence.etats
		}).then(()=>{

			fct()
		})
	},
	delete(agence, idEtat) {
		delete agence.etats[idEtat];
		
	},
	/*
	incNbArticle(store, article) {
		if (typeof(article) != "undefined") {

			var etat = store.getters.getAgence.etats[article.idEtat];
			
			if (typeof(etat.nbArticles) == "undefined") {
				etat.nbArticles = 1;
			}
			else {
				etat.nbArticles++;
			}
			store.getters.getAgence.etats[article.idEtat] = etat;
			store.getters.getDocAgence.update({
				etats : store.getters.getAgence.etats
			})
		}
	},
	decNbArticle(store, article) {
		if (typeof(article) != "undefined") {
			var etat = store.getters.getAgence.etats[article.idEtat];
			if (typeof(etat.nbArticles) == "undefined") {
				etat.nbArticles = 0;
			}
			else {
				etat.nbArticles--;
			}
			store.getters.getAgence.etats[article.idEtat] = etat;
			store.getters.getDocAgence.update({
				etats : store.getters.getAgence.etats
			})
		}
	}*/
	

}

export default {
	api: const_etat
}

