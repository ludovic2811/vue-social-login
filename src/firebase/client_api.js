import firebase from "@/firebase/firebase_api"; 

const const_client = {
	json: {
		nom: '',
		prenom: '',
		tel1: '',
		tel2: '',
		tel3: '',
		adresse: '',
		mail: '',
		articles: [],
		search: ''
	},
	get(store, clientId, fct) {
		store.getters.getDocAgence.collection("clients").doc(clientId).get().then(doc=> {
			var dataClient = doc.data();
			dataClient.id = doc.id;
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
				data.id = doc.id;
				confirm = false;
				if (typeof(data.listByYearConfirmPaye) != "undefined")
					if (typeof(data.listByYearConfirmPaye[year]) != "undefined") {
						confirm = data.listByYearConfirmPaye[year].confirm;
					}

				if (!confirm)
					users.push(data);
			});
			fct (users);
		})
	},
	getAll(docAgence, fct) {		
    	docAgence.collection('clients').orderBy('search').get().then(querySnapshot=> {
    		var docs = querySnapshot.docs.map(function (doc) {
					    const eventData = doc.data()
	    				eventData.id = doc.id
	    				return eventData
					})			
    		fct(docs);
    	})
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

	update(docAgence, client, fct) {
		var search = client.nom.toUpperCase()
		docAgence.collection('clients').doc(client.id).update(
		{
			nom: client.nom,
			prenom: client.prenom,
			tel1: client.tel1,
			tel2: client.tel2,
			tel3: client.tel3,
			mail: client.mail,
			adresse: client.adresse,
			search: search,
			articles: client.articles		
		}).then(success => {
				fct(success);
			})
	},
	add(docAgence, client, fct) {
		console.log(client);
		var search = client.nom.toUpperCase()
		docAgence.collection('clients').add(
			{
				nom: client.nom,
				prenom: client.prenom,
				tel1: client.tel1,
				tel2: client.tel2,
				tel3: client.tel3,
				mail: client.mail,
				adresse: client.adresse,
				search: search,
				articles:[]
			}).then(success => {
				fct(success);
			})
	},
	archiver(docAgence, client, fct) {
		var search = client.nom.toUpperCase()
		docAgence.collection('clientsArchive').doc().set(			{
				nom: client.nom,
				prenom: client.prenom,
				tel1: client.tel1,
				tel2: client.tel2,
				tel3: client.tel3,
				mail: client.mail,
				adresse: client.adresse,
				search: search,
				articles: client.articles
			}).then(success => {
				docAgence.collection('clients').doc(client.id).delete();
				fct(success);
			})
	}
}

export default {
	api: const_client
}