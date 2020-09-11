import firebase from "@/firebase/firebase_api"; 
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
        if (typeof(client)!="undefined")
            store.getters.getDocAgence.collection("clients").doc(client[".key"])
            .collection("paiements").doc(article.numero).get().then(doc=>{
                if (doc.exists)
                    fct(doc.data());
                else
                    fct({});
            })
    },
    confirmPaiementToArticle (store, client, article, paiementData, fct) {
        
            if (typeof(client.paiements) == "undefined") {
                client.paiements = {};
            }
            if (typeof(client.articles[article.numero].paiements) == "undefined") {
                client.articles[article.numero].paiements = {};
            }

            var listPaiementsConfirm = {
                confirm: paiementData.confirm
            }
            client.articles[article.numero].paiements[paiementData.year] = listPaiementsConfirm;
            article = client.articles[article.numero];
            
            var confirmClient = true;
            for (var articleNumero in client.articles) {
                if (typeof(client.articles[articleNumero].paiements) == "undefined") {
                    confirmClient = false;
                    break;
                }
                else {
                    confirmClient = client.articles[articleNumero].paiements[paiementData.year].confirm;
                    if (!confirmClient) {
                        break;                        
                    }
                        
                }
            }
            
            client.paiements[paiementData.year] = {
                confirm: confirmClient
            }
            
            store.getters.getDocAgence.collection("clients").doc(client[".key"]).update({
                articles: client.articles,
                paiements: client.paiements
            }).then(()=>{
                fct(article);
            })
           
    },
    
    set (store, client, article, listPaiements, fct) {
        console.log("ICI DANSSET")
        console.log(listPaiements);
        store.getters.getDocAgence.collection("clients").doc(client[".key"])
            .collection("paiements").doc(article.numero).set(
                listPaiements
        ).then(()=>{
            console.log("ICI DANSSET")
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

