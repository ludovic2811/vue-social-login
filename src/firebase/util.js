const const_util = {
		order(jsonParam) {
				var arrayReturn = []
				
				for (var key in jsonParam) {
					var jsonObject = jsonParam[key];
					jsonObject.id = key;
					arrayReturn.push(jsonObject)
				}
				arrayReturn = arrayReturn.sort(function(a, b){
				    return a.rang-b.rang
				})
				arrayReturn = arrayReturn.map((obj,index)=>{
					var newObject;
					jsonParam[obj.id].rang = index;
					newObject = {
						id: obj.id,
						object: jsonParam[obj.id]
					}
					
					return newObject;
				})
				return arrayReturn;
		},
		updateRang(inArray, outArray) {
			outArray = outArray.map((obj, index)=>{
				obj.object.rang = inArray[obj.object.rang].object.rang ;
				return obj;
			})
		},
		uuid () {
	 
			 return 'xxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
			    return v.toString(16);
			  });
		 },
		 convertYYYYMM(dateParam) {
			var date = new Date(dateParam);
			var month = date.getMonth() + 1;
			if (month < 10)
				month = "0" + month;
			return date.getFullYear()+"-"+month;
		 },
		 convert(dateParam) {
			var date = new Date(dateParam);
			return date.toLocalDateString();
		 },
		 formatDate(date) {
			var date = new Date(date);
			var month = date.getMonth() + 1;
			var day = date.getDate();
			if (month < 10)
				month = "0" + month;
			if (day < 10)
				day = "0" + day;
			return date.getFullYear()+"-"+month+"-"+day;
		},
		convertDateToString(date) {
			var date = new Date(date);
			return date.toLocaleDateString();
		}
		
		
}


export default {
	util: const_util
}