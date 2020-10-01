import agence_api from "@/firebase/agence_api"; 
import firebase_api from "@/firebase/firebase_api"; 
import conso_api from "@/firebase/client_consolidation";
import firebase from "firebase"

const const_client = {
	json: {
		nom: '',
		prenom: '',
		tel1: '',
		tel2: '',
		tel3: '',
		adresse: '',
		mail: '',
		articles: {},
		search: ''
	},
	getArray(store, arrayKeys, fct) {
		
		if (arrayKeys.length !=0) {
			arrayKeys.forEach(key=>{
				this.get(store, key, (client)=>{
					fct(client)
				})
			})
		}
		else {
			fct();
		}
		
	},
	get(store, clientId, fct) {
		store.getters.getDocAgence.collection("clients").doc(clientId).get().then(doc=> {
			var dataClient = doc.data();
			dataClient[".key"] = doc.id;
			fct(dataClient);
		});
	},
	getImpaye(docAgence, year, fct) {
		docAgence.collection("clients").orderBy('search').get().then(querySnapshot=>{
			var docs = querySnapshot.docs;
			var users = [];
			var data ;
			var confirm;
			docs.forEach(doc=> {
				data = doc.data();
				data['.key'] = doc.id;
				confirm = false;
				if (typeof(data.paiements) != "undefined")
					if (typeof(data.paiements[year]) != "undefined") {
						confirm = data.paiements[year].confirm;
					}
			
				if (!confirm && Object.keys(data.articles).length!=0)
					users.push(data);
			});
			fct (users);
		})
	},
	getDocAll(docAgence) {		
		return docAgence.collection('clients').orderBy('search')
		/*
    	docAgence.collection('clients').orderBy('search').get().then(querySnapshot=> {
    		var docs = querySnapshot.docs.map(function (doc) {
					    const eventData = doc.data()
	    				eventData.id = doc.id
	    				return eventData
					})			
    		fct(docs);
    	})*/
	},
	getSearchByPhone(docAgence, search, fct) {		
    	docAgence.collection('clients').orderBy('tel1').startAt(search).endAt(search+'\uf8ff').get().then(querySnapshot=> {
    		var docs = querySnapshot.docs.map(function (doc) {
					    const eventData = doc.data()
	    				eventData.id = doc.id
	    				return eventData
					})
			if (docs.length==0) {
				docAgence.collection('clients').orderBy('tel2').startAt(search).endAt(search+'\uf8ff').get().then(querySnapshot=> {
    			docs = querySnapshot.docs.map(function (doc) {
					    const eventData = doc.data()
	    				eventData.id = doc.id
	    				return eventData
					})
    			fct(docs);
	    			if (docs.length==0) {
					docAgence.collection('clients').orderBy('tel3').startAt(search).endAt(search+'\uf8ff').get().then(querySnapshot=> {
	    			docs = querySnapshot.docs.map(function (doc) {
						    const eventData = doc.data()
		    				eventData.id = doc.id
		    				return eventData
						})
	    			fct(docs);
	    			})
					}
    			})
			}			
    		fct(docs);
    	})
	},
	getSearch(docAgence, search, fct) {		
    	docAgence.collection('clients').orderBy('search').startAt(search).endAt(search+'\uf8ff').get().then(querySnapshot=> {
    		var docs = querySnapshot.docs.map(function (doc) {
					    const eventData = doc.data()
	    				eventData.id = doc.id
	    				return eventData
					})			
    		fct(docs);
    	})
	},
	getSearchByNumero(docAgence, search, fct) {		
    	docAgence.collection('clients').where("listNumeroArticles","array-contains",search).get().then(querySnapshot=> {
    		var docs = querySnapshot.docs.map(function (doc) {
					    const eventData = doc.data()
	    				eventData.id = doc.id
	    				return eventData
					})			
    		fct(docs);
    	})
	},
	/*
	get(docAgence, id, fct) {
		firebase.api.getDb().collection('clients').doc(id).get().then (doc=> {
			fct(doc.data());
		})	
	},*/

	update(store, client, fct) {
		var search = client.nom.toUpperCase()
		store.getters.getDocAgence.collection('clients').doc(client[".key"]).update(
		{
			nom: client.nom,
			prenom: client.prenom,
			tel1: client.tel1,
			tel2: client.tel2,
			tel3: client.tel3,
			mail: client.mail,
			adresse: client.adresse,
			search: search
		}).then(success => {
				fct(success);
			})
	},
	add(store, client, fct) {
		/* Vérification des droits pour l'ajout de client au regard de l'abonnement */
		var error = false;

		if (store.getters.getSubscription == null) {
			if (store.getters.getAgence.nbClients > 5) {
				error = true;
				fct(null, error);
			}
		}
		else {
			var product = store.getters.getSubscription.productRef;
			var nbClients =  store.getters.getSubscription.nbClients
			if (product.limit < nbClients + 1) {
				error = true;
				fct(null, error);
			}
		}

		if (!error) {
			var search = client.nom.toUpperCase();
			store.getters.getDocAgence.collection('clients').add(
				{
					nom: client.nom,
					prenom: client.prenom,
					tel1: client.tel1,
					tel2: client.tel2,
					tel3: client.tel3,
					mail: client.mail,
					adresse: client.adresse,
					search: search,
					articles:{}
				}).then(success => {
					
					agence_api.api.incNbClient(store, ()=>{
					fct(success, false);
				})
			})
		}
		//	});
	}
	,
	restore (agence, idClient, fct) {
		var docAgence = firebase_api.api.getDb().collection("agence").doc(agence.id);
		var docClientArhive = docAgence.collection("clientsArchive").doc(idClient);
		docClientArhive.get().then((client)=>{
			var client = client.data();
			conso_api.api.consolidation(agence, client);
			docAgence.collection("clients").doc(idClient).set(client).then(()=>{
				docClientArhive.collection("paiements").get().then(paiements=>{
					paiements.docs.forEach(paiement => {
						docAgence.collection("clients").doc(idClient)
							.collection("paiements").doc(paiement.id).set(paiement.data())
								.then(()=>{
									paiement.ref.delete();
								})
					});
				})
				// On doit désormais recalculer tout le calcul des espaces pour les entrepots
				for (var idArticle in client.data().articles) {
					var article = client.data().articles[idArticle];
					var articleOld;
					conso_api.api.calculEspaceEntrepot (agence, article, articleOld, (modif)=>{
					});
				}
				// et faire la consolidation
				
				
			})
			docAgence.update({
				nbClients: firebase.firestore.FieldValue.increment(1)
			})
		
			client.ref.delete().then(()=>{
				fct();
			});
		})
	},
	deleteClientArchive (agence, idClient, fct) {
		var docAgence = firebase_api.api.getDb().collection("agence").doc(agence.id);
		var docClientArhive = docAgence.collection("clientsArchive").doc(idClient);
		docClientArhive.get().then((client)=>{
			docClientArhive.collection("paiements").get().then(paiements=>{
				paiements.docs.forEach(paiement => {
					paiement.ref.delete();
				});
			})
			
			client.ref.delete().then(()=>{
				fct();
			});
		})
	},
	archiver(store, client, fct) {
		store.getters.getDocAgence.collection("clients").doc(client['.key']).delete().then(()=>{
			store.getters.getAgence.nbClients--;
			var articleDelete;
			for (var idArticle in client.articles) {
				conso_api.api.calculEspaceEntrepot(
					store.getters.getAgence,
					articleDelete,
					client.articles[idArticle],
					()=>{
						
					})
			}
			fct();
		});
		
	}
}

export default {
	api: const_client
}