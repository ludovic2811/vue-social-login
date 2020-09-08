<template>
<div class="container">
	<s-button icon="plus" label="Ajouter un client"  @onclick="addClient" theme="is-primary"></s-button>
		<div class="listGroup"  v-show="nav==='list'">
			<div class="itemGroup" v-for="client in clients">
	  			<visu-item-client :client="client" @edit="edit(client)" :modif="true" ></visu-item-client>
	    	</div> 
	    </div> 
	    	<edit-client  :client="clientData" v-if="nav=='editClient'" @back="refresh" @refreshClient=""></edit-client>
		
		
</div>
</section>
</template>
<script>
	import client from '@/firebase/client_api'	
	
	import VisuItemClient from '@/views/client/visuItemClient.vue'
	import EditClient from '@/views/client/editClient.vue'
	import firebase_api from "@/firebase/firebase_api"; 

	export default {
		components: {
			VisuItemClient,
			EditClient
		},
		data: function() {
			return  {
				clientData: client.api.json,
				clients: [],
				nav: 'list',
				account: {}
			}
		},
		watch: {
			$route(to, from) {
				this.search(to.query.search)
			}
		},

		methods: {
			
			search (search) {
				if (isNaN(search))
					client.api.getSearch(this.$store.getters.getDocAgence, search, clients=>{						
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
			},
			edit(client) {
				this.clientData = client;
				this.nav = 'editClient';		
			},
			addClient() {
				this.clientData = JSON.parse(JSON.stringify(client.api.json));
				this.nav = 'editClient';			
			},
			refresh() {	/*			
		    	client.api.getAll(this.$store.getters.getDocAgence, clients=>{
		    		this.clients = clients;		
		    		this.nav= 'list';
		    		
		    	});		 */   
		    	this.nav= 'list';
			}
		},
		mounted: function() {	

			  this.$binding("clients", firebase_api.api.getDb().collection("agence")
			  		.doc(this.$store.getters.getAgence.id).collection("clients").orderBy("search"))
			  .then((clients) => {
			  	console.log(this.clients);	
			  });
			  /*		
				if (typeof(this.$route.query.search) == "undefined") {
					client.api.getAll(this.$store.getters.getDocAgence, clients=>{
		    			this.clients = clients;		   
					})
		    	} else
		    	{
					this.search(this.$route.query.search);
		    	}
		    	*/
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