
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
        if (article.numero != '' ) {
            if (typeof(client)!="undefined")
                store.getters.getDocAgence.collection("clients").doc(client[".key"])
                .collection("paiements").doc(article.numero).get().then(doc=>{
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
            if (typeof(client.articles[article.numero].paiements) == "undefined") {
                client.articles[article.numero].paiements = {};
            }

            var listPaiementsConfirm = {
                confirm: paiementData.confirm,
                total: paiementData.total
            }
            client.articles[article.numero].paiements[paiementData.year] = listPaiementsConfirm;
            article = client.articles[article.numero];
            
            // On va sauvegarder l'ancien solde du paiement du client
            var oldPaiementClient = 0;
            
            if (typeof(client.paiements[paiementData.year]) != "undefined") {
                oldPaiementClient = parseFloat(client.paiements[paiementData.year].total);
            }
                
            

            // On réinitialise les paiements du clients
            client.paiements[paiementData.year] = {
                total : 0,
                confirm: false
            }
            // on partours tous les articles du client
            var confirmClient = true;
            var totalClient = 0;
            for (var articleNumero in client.articles) {
                if (typeof(client.articles[articleNumero].paiements) == "undefined") {
                    confirmClient = false;                    
                }
                else {
                    confirmClient = client.articles[articleNumero].paiements[paiementData.year].confirm && confirmClient;
                    if (client.articles[articleNumero].paiements[paiementData.year].confirm)
                        totalClient += parseFloat(client.articles[articleNumero].paiements[paiementData.year].total);
                }
            }
            

            client.paiements[paiementData.year].confirm = confirmClient;
            client.paiements[paiementData.year].total = totalClient;
            
            if (typeof(store.getters.getAgence.paiements)=="undefined") {
                store.getters.getAgence.paiements = {};
                store.getters.getAgence.paiements[paiementData.year] = {
                    total: client.paiements[paiementData.year].total
                };
            }
            else if (typeof(store.getters.getAgence.paiements[paiementData.year]) == "undefined") {
                store.getters.getAgence.paiements[paiementData.year] = {
                    total: client.paiements[paiementData.year].total
                };
            }
            else {
                var totalAgence = store.getters.getAgence.paiements[paiementData.year].total;
                totalAgence = totalAgence + (oldPaiementClient + client.paiements[paiementData.year].total)
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
            .collection("paiements").doc(article.numero).set(
                listPaiements
        ).then(()=>{
           
            fct();
        });
    },
    add (store, client, article, listPaiements, fct) {
        store.getters.getDocAgence.collection("clients").doc(client[".key"])
            .collection("paiements").doc(article.numero).set(
                listPaiements
        ).then(()=>{
            fct();
        });
    }
}

export default {
	api: const_paiement
}

