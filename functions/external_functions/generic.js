module.exports.addArticleToDocument = function  (db, articleRef, context, nameCollection, idCollection) {
	var docArticle = articleRef;
	var dataArticle = docArticle.data();
	var agenceId=context.params.agenceId;
	var docAgence = db.collection("agence").doc(agenceId)
	var docCollection = docAgence.collection(nameCollection).doc(dataArticle[idCollection])

	return docCollection.get().then(doc=>{
		var dataCollection = doc.data();
		var listArticles = [];
		var indexArticle;
		if (typeof(dataCollection.listArticles)!="undefined")
			listArticles = dataCollection.listArticles;
		indexArticle = listArticles.indexOf(articleId);
		if (indexArticle==-1)
			listArticles.push(articleId);
		docCollection.update({
			listArticles : listArticles
		}).then(()=>{return null;})
	})
}