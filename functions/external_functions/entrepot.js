module.exports.addArticleToEntrepot = function  (db, articleRef, context) {

	//if (articleRef.after)
	var dataArticleBefore = null;
	var docArticle = articleRef.after;
	var dataArticle = docArticle.data();
	var modif = true;
	var supIndexStockBefore = false;
	if (articleRef.before.exists) {
		dataArticleBefore = articleRef.before.data();
		if ( (dataArticleBefore.idEntrepot == dataArticle.idEntrepot) 
				&& (dataArticleBefore.indexStock != dataArticle.indexStock))
			supIndexStockBefore = true;
		else if (dataArticleBefore.idEntrepot == dataArticle.idEntrepot) 
			modif = false;

	}
	var JSON_article = {
		numero: "",
		idCategorie,
		indexType
	}
	// Inutile de changer quoi que ce soit dans l'entrepot si on a rien changé
	if (modif) {
		var articleId=context.params.articleId;
		var agenceId=context.params.agenceId;
		var docAgence = db.collection("agence").doc(agenceId)
		var docCollection = docAgence.collection("entrepots").doc(dataArticle.idEntrepot)

		return docCollection.get().then(doc=>{
			var dataCollection = doc.data();
			var listArticles = [];
			var indexArticle;
			var stocks = dataCollection.stocks;
			// On ajoute le nouvel article dans l'entrepot et surtout dans le stock
			if (typeof(stocks[dataArticle.indexStock].listArticles)!="undefined") {
				listArticles = stocks[dataArticle.indexStock].listArticles;
			}
			else {
				stocks[dataArticle.indexStock].listArticles = [];
			}
			indexArticle = listArticles.indexOf(articleId);
			if (indexArticle==-1) {
				stocks[dataArticle.indexStock].listArticles.push(articleId);
			}
			// Si on supIndexStockBefore alors on doit supprimer dans l'ancien stock
			if (supIndexStockBefore) {
				listArticles = stocks[dataArticleBefore.indexStock].listArticles;
				indexArticle = listArticles.indexOf(articleId);
				if (indexArticle!=-1)
					stocks[dataArticleBefore.indexStock].listArticles.splice(indexArticle, 1);		
			}

			docCollection.update({
				stocks : stocks
			}).then(()=>{return null;})
		})
	}
}

module.exports.deleteArticleToEntrepot  = function  (db, articleRef, context) {
	var docArticle = articleRef;
	var dataArticle = docArticle.data();
	var articleId=context.params.articleId;
	var agenceId=context.params.agenceId;
	var docAgence = db.collection("agence").doc(agenceId)
	var docCollection = docAgence.collection("entrepots").doc(dataArticle.idEntrepot)
	return docCollection.get().then(doc=>{
		var dataCollection = doc.data();
		var listArticles = [];
		var indexArticle;
		var stocks = dataCollection.stocks;
		if (typeof(stocks[dataArticle.indexStock].listArticles)!="undefined") {
			listArticles = stocks[dataArticle.indexStock].listArticles;
			indexArticle = listArticles.indexOf(articleId);
			if (indexArticle!=-1) {
				stocks[dataArticle.indexStock].listArticles.splice(indexArticle,1);				
				docCollection.update({
					stocks : stocks
				}).then(()=>{return null;})
			}
			else
				return null;
		}
		else
			return null;

	})
}