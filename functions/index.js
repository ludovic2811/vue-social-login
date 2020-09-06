const functions = require('firebase-functions');

const entrepot_functions = require ('./external_functions/entrepot')
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();
/*
exports.update_Categories_v2 = functions.region('europe-west1').firestore.document('agence/{agenceId}/categories/{categorieId})')
	.onWrite((change,context) => {

		db.collection("agence").doc(context.params.agenceId).collection("categories").get().then((docs)=>{
			docs.forEach(doc=>{
				if (change.after.exists && !change.before.exists)
				var dataCategories = change.after.data().categories;
				doc.set
			})
		})

})*/

exports.updateArticle_V2 = functions.region('europe-west1').firestore.document('agence/{agenceId}/clients/{clientId}/articles/{articleId}')
	.onWrite((change,context) => {
	
	if (change.before.exists) {
		if (change.after.exists)
			if (change.before.data().idEntrepot!=change.after.data().idEntrepot)
				entrepot_functions.deleteArticleToEntrepot(db, change.before, context);			
	}
	// Create or Update
	if (change.after.exists) {
		
		entrepot_functions.addArticleToEntrepot(db, change, context);
	} 
	else {
		entrepot_functions.deleteArticleToEntrepot(db, change.before, context);	
		//client_functions.deleteArticleToClient(db, change.before, context);	
	}

	//generic_functions.addArticleToDocument(db, change, context, "entrepots", "idEntrepot");
})


exports.updateEntrepots_V2 = functions.region('europe-west1').firestore.document('agence/{agenceId}/entrepots/{entrepotId}')
	.onWrite((change,context) => {
		// Create or Update
		if (change.after.exists) {
			var docArticle = change.after.data();
			var capacite = 0;
			var reste = 0;
			docArticle.stocks.forEach(stock=>{
				capacite += stock.capacite;
				if (typeof(stock.listArticles)!="undefined") {
					var nbArticles = stock.listArticles.length;
					stock.reste = stock.capacite - nbArticles;
				}
				else
					stock.reste = stock.capacite;
				if (typeof(stock.reste) == "undefined")
					stock.reste = 0;
				if (stock.reste>0)
					reste +=stock.reste;
			})

			if (!change.before.exists) {
				db.collection("agence").doc(context.params.agenceId).collection("categories").get().then(
					querySnapshot=> {
		    		var docs = querySnapshot.docs.map(function (doc) {
							    const eventData = doc.data()
			    				eventData.id = doc.id
			    				return eventData
							});
		    		return change.after.ref.update({
		    			stocks : docArticle.stocks,
						reste :reste,
						capacite: capacite,
		    			categories : docs
		    		});
				})
			}
			else
				return change.after.ref.update (
				{
					stocks : docArticle.stocks,
					reste :reste,
					capacite: capacite
				}
			)
		}
		
		
})


exports.updateClient_V2 = functions.region('europe-west1').firestore.document('agence/{agenceId}/clients/{clientId}').onWrite((change,context) => {
	if (change.after.exists) {
		var docArticle = change.after.data();
		var listIdEntrepot = [];
		var listNumeroArticles = [];
		var listEtats = [];
		var planning = [];
		var listByYearConfirmPaye = {};
		var MMYYYY;
		var dateParts;

		var listMonth = [];

		var notConfirmBetweenArticle;

		docArticle.articles.forEach(article => {
			listIdEntrepot.push(article.idEntrepot);
			listNumeroArticles.push(article.numero);
			listEtats.push(article.indexEtat);
			
			dateParts = article.partirle.split("-");		
			MMYYYY = dateParts[0] + "-" + dateParts[1];

			if (listMonth.indexOf(MMYYYY) === -1)
				listMonth.push(MMYYYY);
			
			dateParts = article.rentrele.split("-");		
			MMYYYY = dateParts[0] + "-" + dateParts[1];
			if (listMonth.indexOf(MMYYYY) === -1)
				listMonth.push(MMYYYY);

			
			
			for (var year in article.paiements) {
				notConfirmBetweenArticle = true;
				
				if (typeof(article.paiements[year]) != "undefined")
					if (typeof(article.paiements[year].confirm) != "undefined") {
				
						notConfirmBetweenArticle = notConfirmBetweenArticle && !article.paiements[year].confirm;
				
						if (typeof(listByYearConfirmPaye[year]) == "undefined")
							listByYearConfirmPaye[year] = {
								confirm : true,
								total: 0
							}
						listByYearConfirmPaye[year].confirm = !notConfirmBetweenArticle && listByYearConfirmPaye[year].confirm ;
				
						listByYearConfirmPaye[year].total += article.paiements[year].total;
					}
			}
			
			
		});
		return change.after.ref.set (
			{
				listIdEntrepot: listIdEntrepot, 
				listNumeroArticles: listNumeroArticles,
				listEtats: listEtats,
				listMonth: listMonth,
				listByYearConfirmPaye: listByYearConfirmPaye
			}, {merge: true})
			.then(()=>{
				return null;
			})
			.catch((error) => {
				console.error("Counter Error writing document: ", error);
				return null;
			});

	}
})