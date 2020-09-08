<template>
	<div>
		{{refresh}}
	 <button class="add-button" id="btnAdd" v-on:click="$emit('addData')">Add to home screen</button>
		}
	@import "~bulma/css/bulma.css";
		<draggable  draggable=".item"  @end="onEnd">
		    <div v-for="element in dataCollectionArray" :key="element.rang" class="item">
		        {{element.id}} / {{element.rang}} : <input v-model="element.object.rang" /> 
		    </div>
		    <button slot="header">Add</button>
		</draggable>
		
		{{article.dataCollection}}
	</div>
</template>
<script>
	import draggable from 'vuedraggable'
	
	export default {
		props: ["article","refresh"],
		components: {
			draggable
		},
		data() {
			return {
				dataCollectionArray: [],
				
			}
		},
		watch: {
			refresh: function(val) {
				this.dataCollectionArray = 	this.orderFunction(this.article.dataCollection);
				console.log(this.dataCollectionArray);
			}
		},
		/*computed: {
			dataCollectionArray: function() {
				return (this.orderFunction(this.dataCollection))
			}
		},*/
		methods: {
			onEnd(event) {
				console.log(event);
			},
			orderFunction(jsonParam) {
				var arrayReturn = []
				
				for (var key in jsonParam) {
					var jsonObject = jsonParam[key];
					jsonObject.id = key;
					jsonObject.rang = jsonObject.rang;
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
						rang: index,
						object: jsonParam[obj.id]
					}
					
					return newObject;
				})
				return arrayReturn;
			},
			addData() {
				
				this.article.dataCollection["5_098098"] =  {
					rang: 3,
					data: "TOMATE"
				}
				delete this.article.dataCollection["2-7890"];
				console.log(this.article.dataCollection);
			},
			showAlert()  {
				var Pouette = {}
				var nom = "";
				console.log(new Date());
				var number = 1;
				var rang = 100;
				console.log(this.$uuid.v4());
				while (number < 100) {
				    number++;
				    rang--;
				    console.log(this.$uuid.v4());
					Pouette[this.$uuid.v4()] = {
						nom: nom,
						rang: rang - 1
					}
				}

				console.log(new Date());
				console.log(this.orderFunction(Pouette));

			}
		},
		mounted() {
			console.log(this.$uuid.v4())
			console.log(this.$uuid.v4())
			console.log(this.$uuid.v4())
			console.log(this.$reverseText('message'))
		}
	}
	

	/*export default {
		name:"test",
		mounted () {
			let deferredPrompt;

			window.addEventListener('beforeinstallprompt', (e) => {
			  alert("ici");
			  // Prevent Chrome 67 and earlier from automatically showing the Prompt
			  e.preventDefault();
			  // Stash the event so it can be triggered later.
			  deferredPrompt = e;
			  // Update UI notify the user they can add to home screen
			  btnAdd.style.display = 'block';
			});
			btnAdd.addEventListener('click', (e) => {
			  // hide our user interface that shows our A2HS button
			  btnAdd.style.display = 'none';
			  // Show the Prompt
			  console.log("Prompt");
			  deferredPrompt.prompt();  
			  // Wait for the user to respond to the Prompt
			  deferredPrompt.userChoice
			    .then((choiceResult) => {
			      if (choiceResult.outcome === 'accepted') {
			        console.log('User accepted the A2HS Prompt');
			      } else {
			        console.log('User dismissed the A2HS Prompt');
			      }
			      deferredPrompt = null;
			    });
			});
			/*
			firebase.api.getDb().collection("agence").doc().set({
				nom: "Nouvelle Agence"
			})
			console.log("tente : vFffAetwyNGWxoRWAJ4H");
			firebase.api.getDb().collection("agence").doc("vFffAetwyNGWxoRWAJ4H").get().then(doc=>{
				console.log(doc.data());
			})
			console.log("tente : yI3PuXOcv3J8wl8wNQGS");
			firebase.api.getDb().collection("agence").doc("yI3PuXOcv3J8wl8wNQGS").get().then(doc=>{
				console.log(doc.data());
			})
			console.log("tente subClients: yI3PuXOcv3J8wl8wNQGS");
			firebase.api.getDb().collection("agence").doc("vFffAetwyNGWxoRWAJ4H").collection("subClients").get().then(query=>{
				console.log(query);
			})
			*/
			/*
			console.log("TEST")
			console.log(firebase.api.getDb());
			this.$docAgence.collection("clients").where("articles.<articles>.numero", "==", "123456").get().then(docs=>{
				console.log(docs)
			})*/

		/*	
		}
	}*/
</script>
<style>
	.item {
		background-color: white;
		color: block;
		border: solid black thin;
		height: 40px;
	}
</style>