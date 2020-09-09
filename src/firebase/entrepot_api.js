import firebase from "@/firebase/firebase_api"; 

const const_entrepot = {
	store: null,
	json: {
		id: "0",
		nom: '',
		stocks: {},
		capacite: 0
	},
	json_stock: {
		nom: '',
		capacite: 0,
		fige: false,
		articles: []
	},
	
	save (agence, entrepot, fct) {
		agence.entrepots[entrepot.id] = entrepot;
		agence.entrepots[entrepot.id].capacite = 0;
		for (var key in agence.entrepots[entrepot.id].stocks) {
			entrepot.stocks[key].capacite = parseFloat(entrepot.stocks[key].capacite);
			agence.entrepots[entrepot.id].capacite += parseFloat(entrepot.stocks[key].capacite);
		}
		firebase.api.getDb().collection('agence').doc(agence.id).update({
			entrepots: agence.entrepots
		}).then(()=>{fct()})
	},
	getAll(agence, fct) {		
		return agence.entrepots;
	},
	delete(agence, entrepot, fct) {
		delete agence.entrepots[entrepot.id];
		this.save (agence, entrepot, ()=>{
			fct()
		})
	}
}


export default {
	api: const_entrepot
}