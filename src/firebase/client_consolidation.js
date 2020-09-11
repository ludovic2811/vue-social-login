import firebase from "@/firebase/firebase_api"; 

const api = {
	resetCalculEntrepot (entrepots, categories, fct) {
		for (var key in entrepots) {			
			this.subCalculEntrepot (entrepots[key], categories);
		}
		console.log(entrepots);
		fct();
	},
	subCalculEntrepot (entrepot, categories) {
		
		entrepot.reste = 0;
		for (var key in entrepot.stocks) {
			var stock = entrepot.stocks[key];
			var espacePris = 0;
			for (var keyArticle in entrepot.stocks[key].articles) {
				
				var idCategorie = stock.articles[keyArticle].idCategorie;
				var idType      = stock.articles[keyArticle].idType;
				
				espacePris += parseFloat(categories[idCategorie].types[idType].espace);
			}
			
			var reste =  parseFloat(stock.capacite) - espacePris;			
			entrepot.stocks[key].reste = reste;
		}
		if (reste < 0) reste = 0;
		entrepot.reste += reste;
	},
	calculEspaceEntrepot (agence, articleNew, articleOld, fct) {
		var maj = false	;
		var majEntrepotOld = false;
		var majCategorie = false ;
		var majStockOld = false;
		var addEntrepot = true;
		if (typeof(articleOld) != "undefined") {
			if (typeof(articleNew) == "undefined") {
				// ca veut dire qu'il faut qu'on supprime mais qu'on ajoute pas
				maj = true;
				addEntrepot= false;
				majEntrepotOld = true;
				majStockOld = true;
			}
			else {
				if (articleNew.idEntrepot != articleOld.idEntrepot)
					majEntrepotOld = true;
				if (articleNew.idStock != articleOld.idStock)
					majStockOld = true;
				if (articleNew.idCategorie != articleOld.idCategorie ||
					articleNew.idType != articleOld.idType)	
					majCategorie = true;
				maj = majCategorie || majEntrepotOld || majStockOld;
			}
			
		}
		else {
			maj = true;
			majEntrepotOld= false;
			majStockOld = false;
		}
		
		
		if (maj) {
			if (addEntrepot) {
				if (typeof(agence.entrepots[articleNew.idEntrepot].stocks[articleNew.idStock].articles) == "undefined")
					agence.entrepots[articleNew.idEntrepot].stocks[articleNew.idStock].articles = {};
				
				// J'ajoute le nouvel article dans l'entrepot
				agence.entrepots[articleNew.idEntrepot].stocks[articleNew.idStock].articles[articleNew.numero] = {
					idCategorie: articleNew.idCategorie,
					idType: articleNew.idType
				}
				// dans tous les cas je recalcule l'entrepot qui a été attribué à l'article
				this.subCalculEntrepot (agence.entrepots[articleNew.idEntrepot], agence.categories);
			}
			
			if (majEntrepotOld || majStockOld) {
				// je supprime l'article dans l'ancien entrepot ou stock
				// en fait la condition existe si on est dans un nouveau
				if (typeof(agence.entrepots[articleOld.idEntrepot].stocks[articleOld.idStock].articles) != "undefined")
					delete agence.entrepots[articleOld.idEntrepot].stocks[articleOld.idStock].articles[articleOld.numero];
				this.subCalculEntrepot (agence.entrepots[articleOld.idEntrepot], agence.categories);
			}

			firebase.api.getDb().collection("agence").doc(agence.id).update({
				entrepots: agence.entrepots
			}).then(()=>{
				fct()
			});
		}
		else
			fct();
	},
	consolidation(agence, client) {
		var request = {
				ids: [],
				articles: []
			}
		for (var key in client.articles) {
			this.pushArrayUnique(request.ids, client.articles[key].idCategorie);
			this.pushArrayUnique(request.ids, client.articles[key].idStock);
			this.pushArrayUnique(request.ids, client.articles[key].idType);
			this.pushArrayUnique(request.ids, client.articles[key].idEtat);
			this.pushArrayUnique(request.ids, client.articles[key].idEntrepot);
			request.articles.push(key);
		}
		return request;
	},
	pushArrayUnique(arrayInput, id) {
		if (arrayInput.indexOf(id) == -1)
			arrayInput.push(id);
	}
}
export default {
	api: api
}