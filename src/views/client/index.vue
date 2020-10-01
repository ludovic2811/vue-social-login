<template>
<div class="container">
	<my-navbar ></my-navbar>
	 <my-navbarFooter ></my-navbarFooter>
	<in-out
		:client="clientData"
		:article="article"
		@close="openInOut = false"
		:open="openInOut"	
	>
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
	<s-button icon="plus" label="Ajouter"  @onclick="addClient" theme="is-primary"></s-button>
	&nbsp;
	<s-button icon="filter" label="" @onclick="openModalfilter" 
		:theme="(filter!=null) ? 'is-success' : 'is-primary'"></s-button>
	<div class="paginationButton" >
		<div class="before">
			<s-button @onclick="beforeClients"  icon="angle-double-left" theme="button is-primary" 
			label=""
			:disabled="this.page<1">Avant</s-button>
		</div>
		<div class="next">
			<s-button @onclick="nextClients" icon="angle-double-right" theme="button is-primary" 
			label=""
			:disabled="this.page>nbPages()-2" >Suite</s-button>
		</div>
		{{this.page + 1}} / {{nbPages()}} 
	</div>
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
	<filter-client
		:open="openFilter"
		:filter="filter"
		@cancel="openFilter=false"
		@save="applyFilter"
		/>
</div>
</template>
<script>
	import firebase_api from "@/firebase/firebase_api"; 
	import client 		from '@/firebase/client_api'	
	
	import InOut 			from '@/views/client/components/inOut.vue'
	import histoPaiement 	from '@/views/client/components/historiquePaiement.vue'
	
	import EditClient 		from '@/views/client/edit/editClient.vue'
	import ItemClient 		from '@/views/client/itemClient.vue'

	import FilterClient 		from '@/views/client/filter.vue'
	

	export default {
		components: {
			ItemClient,
			EditClient,
			InOut,
			histoPaiement,
			FilterClient
		},
		
		data: function() {
			return  {
				clientData: client.api.json,
				article: null,
				clients: [],
				nav: 'list',
				account: {},
				openInOut: false,
				modalTypePaiement: false,
				openFilter: false,
				filter: null,
				afterPagination: null,
				beforePagination : [],
				page : 0,
				buttonAfterBefore: null,
				nbClients: 0,
				request: null,
				OriginRequest: null,
				searchData : null,
				typeSearchData: null
			}
		},
		watch: {
			$route(to, from) {
				var search;
				var type;
				if (to.query.search != "") {
					search = to.query.search;
					type = to.query.type;
				}
				else
					type = 0;
				if (typeof(search) == "undefined") {
					this.beforePagination  =[];
					this.afterPagination = null;
				}
				this.searchData = search;

				this.typeSearchData = type;
				this.search(this.request)
			}
		},

		methods: {
			nbPages() {
				
				return Math.ceil(this.nbClients / 8);
			},
			beforeClients() {
				if (this.page>0) {
					this.page = this.page - 1;
					
					this.afterPagination = this.beforePagination[this.page];
					this.buttonAfterBefore = "before";
					this.search(this.request)
				}
			},
			nextClients() {
				this.page = this.page + 1;
				this.buttonAfterBefore = "after";
				this.search(this.request)
			},
			applyFilter (filterId) {
				this.filter  = filterId;
				this.openFilter = false;
				this.$unbind('clients');
				
				if (filterId != null) {
					this.request = this.OriginRequest.where("request.ids", "array-contains", this.filter);
					this.request.get().then(clients=>{
							this.nbClients = clients.size;
							
						})
				}
				else
					this.request = this.OriginRequest;

				this.page = 0;
				this.afterPagination = null;
				this.search(this.request);	
			},
			openModalfilter() {
				this.openFilter = true;
			},
			openModalHistoPaiement (client, article) {
				
				this.clientData = client;
				this.article = article;
				
				this.modalTypePaiement = true;

			},
			openModalInOut (client, article) {
				
				this.clientData = client;
				this.article = article;
				this.openInOut = true;
			},
			isPlaque(search) {
				
			},
			requestStart(request, search) {
				var requestTansform = request;
				if (this.page == 0)					
					  requestTansform = requestTansform.startAt(search);
				else {
				if (this.afterPagination != null && this.buttonAfterBefore == "after")
					requestTansform = requestTansform.startAfter(this.afterPagination);
				if (this.afterPagination != null && this.buttonAfterBefore == "before")
					requestTansform = requestTansform.startAt(this.afterPagination);
				}
				return requestTansform;
			},
			search (request) {
				
					 
				var requestTempo = request.orderBy("search");
				
				if (typeof(this.searchData)=="undefined" || this.searchData == null) {
					
					if (this.afterPagination != null && this.buttonAfterBefore == "after") {
						
						requestTempo = requestTempo.limit(8).startAfter(this.afterPagination);
					}
					else if (this.afterPagination != null && this.buttonAfterBefore == "before")
						requestTempo = requestTempo.limit(8).startAt(this.afterPagination);
					else {
						
						requestTempo = requestTempo.limit(8);
					}
					this.$binding("clients", requestTempo)
			  		.then((clients) => {
						   if (this.filterId == null)
								   this.nbClients = this.$store.getters.getAgence.nbClients;
							
						   if (clients.length != 0) {
								this.afterPagination = clients[clients.length-1].search;
								this.beforePagination[this.page]  = clients[0].search;
						   }
						   else
								this.afterPagination = null;
							
						   
						   this.buttonAfterBefore = "after";
			  		});	
				}
				else if (this.typeSearchData == 0) {
					
					var requestWithoutLimit = this.requestStart(requestTempo, this.searchData);
					
					if (this.page == 0) {
						requestWithoutLimit.get().then(clients=>{
							this.nbClients = clients.size;
						})
					}
					var requestWidthLimit = this.requestStart(requestTempo.limit(8), this.searchData);
					this.$binding("clients", requestWidthLimit)
			  		.then((clients) => {
						  	    if (clients.length != 0) {
									   this.afterPagination = clients[clients.length-1].search;
									   this.beforePagination[this.page]  = clients[0].search;
								}
								else this.afterPagination = null;
						   	   
						  	   this.buttonAfterBefore = "after";
						 
			  		});	
				} else if (this.typeSearchData==1) {
					
					this.page = 0;
					this.buttonAfterBefore = null;
					this.afterPagination = null;
					this.FilterClient = null;
					this.$binding("clients", firebase_api.api.getDb().collection("agence")
						.doc(this.$store.getters.getAgence.id).collection("clients")
						.where("request.articles","array-contains",this.searchData))
						.then((clients) => {
							this.nbClients = clients.length;
					})
				}
				else if (this.typeSearchData == 2) {
					this.page = 0;
					this.buttonAfterBefore = null;
					this.afterPagination = null;
					this.FilterClient = null;
					this.$binding("clients", firebase_api.api.getDb().collection("agence")
					  	.doc(this.$store.getters.getAgence.id).collection("clients")
						.where("tel1","==", this.searchData))
			  			.then((clients) => {
							  this.nbClients = clients.length;
			  		})
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
			this.OriginRequest = firebase_api.api.getDb().collection("agence")
					  .doc(this.$store.getters.getAgence.id).collection("clients")
			this.request = this.OriginRequest;
			this.search(this.request);
		}
	}
</script>
<style scoped>
.itemGroup {
    background-color: white;    
    height: 450px;
    width: 300px;
    display: inline-block;
    padding: 10px;
    float: left;
    margin: 5px;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}
.listGroup {
    vertical-align: top;
    overflow-y: auto;
    height: 800px;
	width: 100%;
    text-align: center;
	padding-left: 10px;
    
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
.paginationButton {
	float: right;
}
.paginationButton .next {
	margin-right: 5px;
	display: inline-block;
}
.paginationButton .before {
	margin-right: 5px;
	display: inline-block;
}
</style>