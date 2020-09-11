

const const_planning = {
	getClientsByMonth(store, YYYYMM, fct) {
		
		store.getters.getDocAgence.collection("inout").where("yyyymm","array-contains",YYYYMM).get()
			.then(querySnapshot=>{
				var planning = {};
				var inPlanning = {
					rentreLe: [],
					departLe: []
				}

				querySnapshot.docs.forEach(doc => {
						var dataInOut = doc.data();
						
						
						if (typeof(planning[dataInOut.rentreLe]) == "undefined") {
							planning[dataInOut.rentreLe] = JSON.parse(JSON.stringify(inPlanning))
						}
						planning[dataInOut.rentreLe].rentreLe.push(dataInOut);

						if (typeof(planning[dataInOut.departLe]) == "undefined")
							planning[dataInOut.departLe] = JSON.parse(JSON.stringify(inPlanning))
						planning[dataInOut.departLe].departLe.push(dataInOut);
						return dataInOut;
					})			
				
    			fct(planning);
			})
	}
}



export default {
  api: const_planning
};