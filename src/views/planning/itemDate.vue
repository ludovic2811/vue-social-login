<template>
	<s-modal :open="open" :title="date" :save="false" :cancel="false" :close="true" @save="" @cancel="" @close="$emit('close')">
		<div class="tabs is-large is-boxed is-toggle-rounded is-fullwidth">
		  <ul>
		    <li :class=" (InOut=='rentreLe') ? 'is-active' : ''" 
				v-on:click="changeTab('rentreLe')">
		    	<a >
		    		<span class="icon is-small">
		    			<i class="fa fa-arrow-circle-right"/>&nbsp;&nbsp;
		    			<span class="subtitle is-6">Doit rentrer</span>&nbsp;&nbsp;
		    		</span>
		    	</a>
		    </li>
		    <li :class=" (InOut=='departLe') ? 'is-active' : ''"  
				v-on:click="changeTab('departLe')">
		    	<a>
		    		<span class="icon is-small">
		    			<i class="fa fa-arrow-circle-left"/>&nbsp;&nbsp;
		    			<span class="subtitle is-6">Doit partir</span>&nbsp;&nbsp;
		    		</span>
		    	</a>
		    </li>
		  </ul>
		</div>
		
		<div class="listClients">
				<div v-for="(itemInOut) in inouts[InOut]">
						<item-list-client :itemInOut="itemInOut" @openClientItem="openClientItem" />
				</div>
					
		</div>
			
		</div>
		<s-modal :open="openClient" title="Client" :save="false" :cancel="false" :close="true" 
			@save="" @cancel="" @close="openClient=false">
			<visu-item-client  :client="client" @edit="" v-if="openClient" :modif="false">
			</visu-item-client>
		</s-modal>
	</s-modal>
</template>
<script>
	import ItemClient from 		'@/views/client/itemClient.vue'
	import ItemListClient from 	'@/views/planning/itemListClient.vue'
	import client_api from 		"@/firebase/client_api"
	
	
	export default {
		props:["open"],
		data: function() {
			return {
				InOut: 1, // 0 rentreLe 1 departLe
				openModalEtat: false,
				client: null,
				openClient: false,
				date: "",
				inouts: [],
				clients: [],
				tabClients: []
			}
		},
		watch: {
			open: function() {
				this.InOut = "rentreLe";
			}
		},
		components: {
			ItemClient,
			ItemListClient
		},
		methods: {
			openClientItem(client) {
				this.client = client;
				this.openClient = true;
			},
			init(date, inouts, fct) {
				this.date = date;
				this.inouts = inouts;				
				if (typeof(this.inouts) != "undefined") {
					var indexRentreLe = 0;
					var indexDepartLe = 0;
					this.inouts.rentreLe.forEach((inout,index)=>{
						client_api.api.get(this.$store, inout.idClient, client=>{
							inout.client = client;
							inout.article = client.articles[inout.numero];
							inout.tab = "rentreLe";
							indexRentreLe = index;
							fct(indexRentreLe, indexDepartLe);
						})						
					})
					this.inouts.departLe.forEach((inout, index)=>{
						client_api.api.get(this.$store, inout.idClient, client=>{
							inout.client = client;
							inout.article = client.articles[inout.numero];
							inout.tab = "departle";
							indexDepartLe = index;
							fct(indexRentreLe, indexDepartLe);
						})						
					})
				}
			},
			changeTab(InOut) {
				this.tabClients = this.clients[InOut];
				this.InOut = InOut;
			},
			
			
			

		},
		mounted: function () {
			console.log("mounter()");			
		}
	}
</script>
<style scoped>
	.itemArticle {
		margin-bottom: 20px;
	}
	.listClients {
		height: 300px;
		overflow-y: auto;
	}
</style>