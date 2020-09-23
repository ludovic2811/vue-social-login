
const const_paiement = {
	json_paiement : {
		year: '',
        total: 0,
        estimate_price: 0,
        confirm: false,
        echeances: []
    },
    json_echeance: {
        prix: 0,
        libelle: '',
        typePaiement: null
    },
    
	getAll (store, client, article , fct) {
        if (article.id != '' ) {
            if (typeof(client)!="undefined")
                store.getters.getDocAgence.collection("clients").doc(client[".key"])
                .collection("paiements").doc(article.id).get().then(doc=>{
                    if (doc.exists)
                        fct(doc.data());
                    else
                        fct({});
            })
        }
    },
    confirmPaiementToArticle (store, client, article, paiementData, fct) {
        
            if (typeof(client.paiements) == "undefined") {
                client.paiements = {};
            }
            if (typeof(client.articles[article.id].paiements) == "undefined") {
                client.articles[article.id].paiements = {};
            }

            var listPaiementsConfirm = {
                confirm: paiementData.confirm,
                total: paiementData.total
            }
            client.articles[article.id].paiements[paiementData.year] = listPaiementsConfirm;
            article = client.articles[article.id];
            
            // On va sauvegarder l'ancien solde du paiement du client si il était confirmé car sinon on ne l'a pas comptabilisé
            var oldPaiementClient = 0;
            
            if (typeof(client.paiements[paiementData.year]) != "undefined") {
                oldPaiementClient = parseFloat(client.paiements[paiementData.year].total);
            }
                
            

            // On réinitialise les paiements du clients
            client.paiements[paiementData.year] = {
                total : 0,
                confirm: false
            }
            // on parcours tous les articles du client
            var confirmClient = true;
            var totalClient = 0;
            for (var idArticle in client.articles) {
                if (typeof(client.articles[idArticle].paiements) == "undefined") {
                    confirmClient = false;                    
                }
                else {
                    confirmClient = client.articles[idArticle].paiements[paiementData.year].confirm && confirmClient;
                    if (client.articles[idArticle].paiements[paiementData.year].confirm)
                        totalClient += parseFloat(client.articles[idArticle].paiements[paiementData.year].total);
                }
            }
            

            client.paiements[paiementData.year].confirm = confirmClient;
            client.paiements[paiementData.year].total = totalClient;
            
            if (typeof(store.getters.getAgence.paiements)=="undefined") {
                store.getters.getAgence.paiements = {};
                store.getters.getAgence.paiements[paiementData.year] = {
                    total: parseFloat(client.paiements[paiementData.year].total)
                };
            }
            else if (typeof(store.getters.getAgence.paiements[paiementData.year]) == "undefined") {
                store.getters.getAgence.paiements[paiementData.year] = {
                    total: parseFloat(client.paiements[paiementData.year].total)
                };
            }
            else {
                var totalAgence = parseFloat(store.getters.getAgence.paiements[paiementData.year].total);
                totalAgence = (totalAgence - oldPaiementClient) + parseFloat(client.paiements[paiementData.year].total);
                store.getters.getAgence.paiements[paiementData.year].total = totalAgence;
            }
            
            store.getters.getDocAgence.collection("clients").doc(client[".key"]).update({
                articles: client.articles,
                paiements: client.paiements
            }).then(()=>{
                store.getters.getDocAgence.update({
                    paiements: store.getters.getAgence.paiements
                })
                fct(article);
            })
           
    },
    
    set (store, client, article, listPaiements, fct) {
        
        store.getters.getDocAgence.collection("clients").doc(client[".key"])
            .collection("paiements").doc(article.id).set(
                listPaiements
        ).then(()=>{
           
            fct();
        });
    },
    add (store, client, article, listPaiements, fct) {
        store.getters.getDocAgence.collection("clients").doc(client[".key"])
            .collection("paiements").doc(article.id).set(
                listPaiements
        ).then(()=>{
            fct();
        });
    }
}

export default {
	api: const_paiement
}

