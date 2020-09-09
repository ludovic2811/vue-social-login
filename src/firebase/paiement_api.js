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
        type_paiement: null
    },
	getAll (store, client , fct) {
        store.getters.getDocAgence.collection("client").doc(client.id)
            .collection("paiements").get().then(docs=>{
                
                fct(docs);
            })
    },
    set (store, client, paiementData, echeanceData, fct) {
        paiementData.total += parseFloat(echeanceData.prix);
        paiementData.confirm = parseFloat(paiementData.estimate_price) == paiementData.total;
        paiementData.echeances.push(echeanceData);
        store.getters.getDocAgence.collection("client").doc(client.id)
            .collection("paiements").doc(paiementData.year).set({
                paiementData
        }).then(()=>{
            fct();
        });
    }
}

export default {
	api: const_paiement
}

