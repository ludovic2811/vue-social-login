<template>
	<div>
	 <button class="add-button" id="btnAdd" v-on:click="showAlert">Add to home screen</button>
	@import "~bulma/css/bulma.css";
	</div>
</template>
<script>
	import firebase from "@/firebase/firebase_api"; 
	
	export default {
		methods: {
			showAlert: () => {
				alert('ici')
			}
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
