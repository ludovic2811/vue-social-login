module.exports.addArticleToClient = function (db, articleRef, context) {
	/**** N'est plus utilisé ***/
	var docArticle = articleRef;
	var dataArticle = docArticle.data();
	
	var clientId=context.params.clientId;
	var agenceId=context.params.agenceId;
	//var articleId=context.params.articleId;
	
	var docAgence = db.collection("agence").doc(agenceId)
	var docClient = docAgence.collection("clients").doc(clientId)
	var articles = [];
	
	return docClient.get().then(doc=>{
		
		var dataClient = doc.data();
		if (typeof(dataClient.articles)!="undefined") {
			articles = dataClient.articles;
			var indexArticle = articles.findIndex(article => article.numero === dataArticle.numero);
			if (indexArticle == -1) 
				articles.push(dataArticle);
			else 
				articles[indexArticle] = dataArticle;
				
	
		}
		else {
			articles.push(dataArticle);
		}
		docClient.update({
			articles : articles
		}) 
	})
}
module.exports.deleteArticleToClient = function (db, articleRef, context) {
	var docArticle = articleRef;
	var dataArticle = docArticle.data();
	
	var clientId=context.params.clientId;
	var agenceId=context.params.agenceId;
	//var articleId=context.params.articleId;
	
	var docAgence = db.collection("agence").doc(agenceId)
	var docClient = docAgence.collection("clients").doc(clientId)
	var articles = [];
	return docClient.get().then(doc=>{
		if (doc.exists) {
			var dataClient = doc.data();
			if (typeof(dataClient.articles)!="undefined") {
				articles = dataClient.articles;
				var indexArticle = articles.findIndex(article => article.numero === dataArticle.numero);
				if (indexArticle != -1) {
					articles.splice(indexArticle, 1);
					docClient.update({
						articles : articles
					}).then(()=>{return null})
				}
				else 
					return null;
			}
			else {
				return null;
			}
		}
		
	})
}