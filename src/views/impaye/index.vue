<template>
	<div class="container">
		<span class="label">
			Mettre l'année : <input type="number" v-model="year" size="4"></input>
		</span>
		<s-button theme="is-primary" label="Rafraichir la liste des impayés" icon="fas fa-refresh" @onclick="init()"></s-button>
		
			<div v-for="client in clients" class="userItem">
				<s-button icon="eye" label="" theme="is-primary" @onclick="openClientItem(client)"/>&nbsp;
				{{client.nom}} {{client.prenom}} &nbsp;&nbsp;
				<button class="button is-small is-primary is-rounded" v-on:click="call(client.tel1)" v-if='client.tel1 != ""'>
			<span class="numtel">{{client.tel1}}</span>
			&nbsp;&nbsp;<i class="fa fa-phone"/>
		</button>&nbsp;
				<div class="itemTypePaiement">
				<span class="buttonPaiement" v-for="(article, indexArticle) in client.articles">
					{{article.numero}} : 
					<s-button-paiement 
						:change="modalTypePaiement" 
						:article="article" 
						@onclick="openPaiement(article, client)"></s-button-paiement>
					
				</span>
				</div>
				
				
			</div>
		

		<s-modal :open="openClient" title="Client" :save="false" :cancel="false" :close="true" @save="" @cancel="" @close="openClient=false">
		<item-client :client="clientData" @edit="" v-if="clientData!=null" :modif="false">
		</item-client>
		</s-modal>
		<histoPaiement 
					:article="articleData" 
					:client="clientData"
					:open="modalTypePaiement" 
					:cancel="false" 
					@close="modalTypePaiement=false"
					@cancel=""
					@save=""
					
				>
		</histoPaiement>
	</div>
</template>
<script>
	import histoPaiement 	from '@/views/client/components/historiquePaiement.vue'
	import SButtonPaiement 	from '@/views/client/components/SButtonPaiement.vue'

	import client_api 		from '@/firebase/client_api'	
	import ItemClient 		from '@/views/client/itemClient.vue'
	
	export default {
		data: function() {
			return {
				year: (new Date()).getFullYear(),
				clients:[],
				openClient: false,
				clientData: null,
				modalTypePaiement: false,
				articleData: null
			}
		},
		components: {
			ItemClient,
			histoPaiement,
			SButtonPaiement
		},
		methods :{
			save(client) {
				
				client_api.api.update(this.$store.getters.getDocAgence, this.clientData, ()=> {
					this.modalTypePaiement=false;
					
				})
			},		
			openClientItem(client) {
				this.clientData = client;
				this.openClient = true;
			},
			openPaiement(article, client) {
				this.clientData = client;
				this.articleData = article;
				this.modalTypePaiement = true;
			},
			init() {
				client_api.api.getImpaye(this.$store.getters.getDocAgence, this.year, clients=>{
								this.clients = clients;
							})
			}
		}
	}

</script>
<style>
	.userItem {
		border: thin black solid;
		width: 80%;
		margin: 5px;
		padding: 2px;
		display: block;
		
	}
	.itemTypePaiement {
		text-align: right;
		wdith: 100%;

	}
	.buttonPaiement {
		
		margin-right: 0px;
	}
</style>