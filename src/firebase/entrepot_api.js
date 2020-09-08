import firebase from "@/firebase/firebase_api"; 

const const_entrepot = {
	store: null,
	json: {
		id: "0",
		nom: '',
		stocks: {}
	},
	json_stock: {
		nom: '',
		capacite: 0,
		fige: false
	},
	
	save (agence, entrepot, fct) {
		agence.entrepots[entrepot.id] = entrepot;
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