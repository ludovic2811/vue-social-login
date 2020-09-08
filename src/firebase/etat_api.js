import firebase from "@/firebase/firebase_api"; 
const const_etat = {
	json_etat : {
		nom: '',
		icon: ''
	},
	save(agence, fct) {
		firebase.api.getDb().collection("agence").doc(agence.id).update({
			etats : agence.etats
		}).then(()=>{
			fct()
		})
	},
	delete(agence, idEtat, fct) {
		delete agence.etats[idEtat];
		
	}
	

}

export default {
	api: const_etat
}

