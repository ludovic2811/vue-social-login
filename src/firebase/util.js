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
		 }
		
		
}


export default {
	util: const_util
}