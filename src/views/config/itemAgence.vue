<template>
	<div :class="isAgenceSelected ? 'itemAgenceSelected' : 'itemAgence'">
		<span class="label">{{agence.nom}}
			<div style="float:right" >
				
				<s-button v-if="subscriptionProduct!='' && isAgenceSelected" 
					:label="subscriptionProduct.product.name" 
					:theme="subscriptionProduct.status=='active' ? 'is-success is-small' : 'is-danger is-small'" 
					:icon="subscriptionProduct.status=='active' ? 'check' : 'ban'" />
				<s-button v-if="subscriptionProduct=='' && isAgenceSelected" 
					label="TEST" 
					theme="is-success is-small" 
					icon="check" />
				<div class="checkAgence" >
					
			<s-button 
				v-if="!isAgenceSelected && agence.finish==$steps"
				@onclick="checkAgence(agence)" :icon="icon" label="Selectionner" theme="is-warning is-small" /> 
					</div>
			</div>
		</span>
		<div class="subscription" v-show="agence.finish==$steps">
				<span v-show="isCreated()">Crée par {{displayName}}</span>
				<span v-show="!isCreated()">Inivté par {{displayName}}</span>
				
							
		</div>
		
		
		<s-button  @onclick="editAgence(agence)" label="Configurer" :theme="theme" icon="edit" :disabled="!isCreated()">
			
		</s-button>
		&nbsp;&nbsp;
		<s-button  @onclick="listClientsArchives(agence)" label="Clients arhivés" 
			:theme="theme" icon="user-slash" :disabled="!isCreated()"></s-button>
	
		</s-button>
		<div class="checkAgence">
		<s-button v-show="isAgenceSelected && agence.finish==$steps" @onclick="$router.push('/client')" 
			label="GO" :theme="theme" icon="play">
			
		</s-button>
		</div>
		<div style="margin-top: 5px" v-show="isCreated()">
			<router-link :to="{ name: 'DeleteAgence', params: { idAgence: agence.id } }" >
				<s-button @onclick="" label="Supprimer" theme="is-danger is-small" icon="trash"  :disabled="!isCreated">
				</s-button>
			</router-link>
		
		</div>
		<div  v-show="agence.finish!=$steps">
			<b>L'agence n'est pas finalisée. Vous êtes à l'étape {{agence.finish+1}}</b>
		</div>
		&nbsp;
		<s-modal
			title="Liste des clients archivés"
			:open="modalListeClientsArchives"
			:save="false"
			:close="true"
			:cancel="false"
			@close="modalListeClientsArchives=false"
		>
			<div v-if="clientsArchives.length==0">
				Aucun clients archivés
			</div>
			<div v-for="client in clientsArchives">
				<div >
					{{client.data().nom}}
					{{client.data().prenom}}
					<div style="float: right">
						<s-button label="Restaurer" icon="undo" theme="is-success is-small" 
							@onclick="restore(client.id)"/>
						&nbsp;
						<s-button label="Supprimer définitivement" icon="trash" theme="is-danger is-small" 
							@onclick="deleteClientArchive(client.id)"/>
					</div>
				</div>
			</div>
		</s-modal>
	</div>
</template>
<script>
	import subscription_api from '@/firebase/subscription_api'
	import user_api from '@/firebase/user_api'
	import agence_api from '@/firebase/agence_api'
	import client_api from '@/firebase/client_api'
	import vuefire 			from "@/firebase/vuefire"
	export default {
		props: ["agence","label", "icon","theme","isAgenceSelected"],
		data() {
			return {
				subscriptionProduct: "",
				displayName: "",
				modalListeClientsArchives: false,
				clientsArchives: []
			}
			
		},
		methods: {
			isCreated() {
				
				return (this.agence.userIdCreated == this.$store.getters.getUser.id);
			},
			deleteClientArchive (idClient) {
				client_api.api.deleteClientArchive(this.agence, idClient, ()=>{
					this.listClientsArchives(this.agence);
				})
			},
			restore(idClient) {
				
				client_api.api.restore(this.agence, idClient, ()=>{
					this.listClientsArchives(this.agence);
				})
			},
			listClientsArchives(agence) {
				agence_api.api.listClientsArchives(agence,clients=>{
					this.clientsArchives = clients;
					this.modalListeClientsArchives = true;
				})
				
			},
			confirmDeleteAgence() {
				this.$route("./deleteAgence");
			},
			checkAgence(agence) {
				this.$emit("checkAgence", agence);
			},
			editAgence(agence) {
				this.$emit("editAgence", agence);	
			},
			getIconAbonnement() {
				if (this.agence.abonnement == "BABY")
					return "baby";
				if (this.agence.abonnement == "DOVE")
					return "dove";
				if (this.agence.abonnement == "SPIDER")
					return "spider";
				if (this.agence.abonnement == "DRAGON")
					return "dragon"
			}
		},
		mounted() {
			subscription_api.api.getSubscriptionByAgence(this.agence, product=>{
				this.subscriptionProduct = product;
			});
			user_api.api.getUser(this.agence.userIdCreated, user=>{
				this.displayName = user.displayName;
				if (this.displayName == this.$store.getters.getUser.displayName)
					this.displayName = "VOUS"
			})
		}
	}
</script>
<style scoped>
	.itemAgence {
		width: 310px;
		height: 150px;
		border : thin silver solid; 
		margin-bottom: 10px;
		padding: 10px;
		margin-right: 5px;
		background-color: rgb(216, 216, 216);
		color: rgb(161, 160, 160);
	}
	.itemAgence .label {
		color:rgb(161, 160, 160);
	}
	.itemAgenceSelected {
		width: 310px;
		height: 150px;
		border : thin silver solid; 
		margin-bottom: 10px;
		padding: 10px;
		margin-right: 5px;
	}
	.checkAgence {
		float: right;
		margin-top: 5px
	}
	.subscription {
		font-size: small;
		font-style: italic;
		padding-top: 5px;
		padding-bottom: 5px;
	}
	.subscription div {
		font-weight: bolder;
		float: right;
		font-style: normal;
	}
</style>