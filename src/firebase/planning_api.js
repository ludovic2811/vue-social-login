import firebase from "@/firebase/firebase_api"; 

const const_planning = {
	getClientsByMonth(store, YYYYMM, fct) {
		
		store.getters.getDocAgence.collection("clients").where("listMonth","array-contains",YYYYMM).get().then(querySnapshot=>{
			var docs = querySnapshot.docs.map(function (doc) {
					    const eventData = doc.data()
	    				eventData.id = doc.id
	    				return eventData
					})			
    		fct(docs);
		})
	}
}



export default {
  api: const_planning
};