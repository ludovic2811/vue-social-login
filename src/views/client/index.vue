<template>
<div class="container">
	<in-out
		:client="clientData"
		:article="article"
		@close="openInOut = false"
		:open="openInOut"	>
	</in-out>	
	<histoPaiement 
		:article="article" 
		:client="clientData"
		:open="modalTypePaiement" 
		:cancel="false" 
		@close="modalTypePaiement=false"
		@cancel=""
		@save=""
		
	>
	</histoPaiement>
	<s-button icon="plus" label="Ajouter un client"  @onclick="addClient" theme="is-primary"></s-button>
	<div class="listGroup"  v-show="nav==='list'">
		<div class="itemGroup" v-for="client in clients">
			<item-client 
				:client="client" 
				@edit="edit(client)" 
				@openModalInOut = "openModalInOut"
				@openModalHistoPaiement = "openModalHistoPaiement"
				:modif="true" >
			</item-client>
		</div> 
	</div> 
	<edit-client  
		v-if="nav=='editClient'"
		:client="clientData" 
			@back="refresh" 
			@refreshClient="">

	</edit-client>
	
</div>
</template>
<script>
	import firebase_api from "@/firebase/firebase_api"; 
	import client 		from '@/firebase/client_api'	
	
	import InOut 			from '@/views/client/components/inOut.vue'
	import histoPaiement 	from '@/views/client/components/historiquePaiement.vue'
	
	import EditClient 		from '@/views/client/edit/editClient.vue'
	import ItemClient 		from '@/views/client/itemClient.vue'
	

	export default {
		components: {
			ItemClient,
			EditClient,
			InOut,
			histoPaiement
		},
		
		data: function() {
			return  {
				clientData: client.api.json,
				article: null,
				clients: [],
				nav: 'list',
				account: {},
				openInOut: false,
				modalTypePaiement: false
			}
		},
		watch: {
			$route(to, from) {
				console.log("WATCH ROUTE")
				this.search(to.query.search)
			}
		},

		methods: {
			openModalHistoPaiement (client, article) {
				console.log("COUCOU PAIEMENT")
				this.clientData = client;
				this.article = article;
				console.log(client);
				console.log(article);
				this.modalTypePaiement = true;

			},
			openModalInOut (client, article) {
				
				this.clientData = client;
				this.article = article;
				this.openInOut = true;
			},
			search (search) {
				if (typeof(search)=="undefined") {
					
					this.$binding("clients", firebase_api.api.getDb().collection("agence")
			  		.doc(this.$store.getters.getAgence.id).collection("clients").orderBy("search"))
			  		.then((clients) => {
			  	
			  		});	
				}
				else if (isNaN(search)) {
					this.$binding("clients", firebase_api.api.getDb().collection("agence")
					  .doc(this.$store.getters.getAgence.id).collection("clients")
					  .orderBy("search")
					  .startAt(search).endAt(search+'\uf8ff') )
			  		.then((clients) => {
						  if (this.clients.length == 0) {
							  this.$binding("clients", firebase_api.api.getDb().collection("agence")
								.doc(this.$store.getters.getAgence.id).collection("clients")
								.where("request.articles","array-contains",search))
								.then((clients) => {
									
								})
						  }
			  		});	
				} else {
					this.$binding("clients", firebase_api.api.getDb().collection("agence")
					  .doc(this.$store.getters.getAgence.id).collection("clients")
					  .orderBy("tel1")
					  .startAt(search))
			  		.then((clients) => {
			  	
			  		});	
				}
				/*	client.api.getSearch(this.$store.getters.getDocAgence, search, clients=>{						
		    			this.clients = clients;
		    			if (this.clients.length == 0) {
		    				client.api.getSearchByNumero(this.$store.getters.getDocAgence, search, clients=>{						
		    					this.clients = clients;
		    				});
		    			}
		    		})
				else 
					client.api.getSearchByPhone(this.$store.getters.getDocAgence, search, clients=>{						
		    			this.clients = clients;
					})
				*/
			},
			edit(client) {
				this.clientData = client;
				this.nav = 'editClient';		
			},
			addClient() {
				this.clientData = JSON.parse(JSON.stringify(client.api.json));
				this.nav = 'editClient';			
			},
			refresh() {
		    	this.nav= 'list';
			}
		},
		mounted: function() {	
			
			this.search();
			  		  
		}
	}
</script>
<style scoped>
.itemGroup {
    background-color: white;    
    height: 450px;
    width: 350px;
    display: inline-block;
    padding: 10px;
    float: left;
    margin: 5px;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}
.listGroup {
    vertical-align: top;
    overflow-y: auto;
    height: 460px;
    text-align: center;
    
}
.inventaire {
    vertical-align: top;
    overflow-y: scroll;
    height: 200px;
    text-align: center;
}
.title {
	font: medium bolder;
}
.adresse {
	font-size: smaller ;
	
}
</style>