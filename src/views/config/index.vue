<template>
	<div class="container">
			<my-navbar ></my-navbar>
			<div class="subscription" v-if="subscriptionBind.subscription" >
				<div>
					
					<span class="titleSubscription" >
						
					Votre abonnement : {{product.name}}
					<div style="float:right" v-if="product.name!='aucun'">
						<s-button 
							:theme="subscriptionBind.subscription.status=='active' ? 'is-success is-small' : 'is-danger is-small'"
							:label="subscriptionBind.subscription.status"
							:icon="subscriptionBind.subscription.status=='active' ? 'check' : 'ban'">
						</s-button>
					</div>
					</span>
					
					<span v-if="product.name!='aucun'" style="width:100px">
						<br/>
							Vous êtes limité à {{product.limit}} clients pour toutes vos agences
					</span>
				
				</div>
				
				<div style="float:right;" >
					<s-button label="Visualiser" v-if="subscriptionBind.subscription.status=='active'"
						:theme="themeGoAccount" :disabled="disabled" icon="eye" @onclick="goAccount()"/>
					
					<s-button 
						label="Ajouter" theme="is-success" icon="plus" @onclick="addSubstription()"  
						v-if="subscriptionBind.subscription.status=='canceled'"/>
					
				</div>
				<div class='info'>
						Si vous venez de résilier ou d'ajouter un abonnement, <br/>
						veuillez patientez quelques secondes pour la mise à jour ...
				</div>
			</div>
			<div class="subscription" v-if="!subscriptionBind.subscription" >
					<br/>
					Vous n'avez aucun abonnement. <br/>Vous êtes en mode test limité à 5 clients
					<br/>
					<s-button 
						label="Abonnez vous" theme="is-success" icon="plus" @onclick="addSubstription()" />
					<div class='info'>
					Si vous venez de résilier ou d'ajouter un abonnement, <br/>
					veuillez patientez quelques secondes pour la mise à jour ...
					</div>
			</div>
			<s-button @onclick="createAgence" icon="plus" label="Nouvelle agence" theme="is-primary">
			</s-button>
			<br/><br/>
			<ul>
				<li v-for="agence in agences">
					<item-agence 
						:label="(agence.id == $store.getters.getUser.idAgenceSelected) ? 'Sélectionnée' : 'Sélectioner'" 
						:icon="(agence.id == $store.getters.getUser.idAgenceSelected) ? 'check' : 'ban'"
						:theme="(agence.id == $store.getters.getUser.idAgenceSelected) ? 'is-primary' : 'is-danger'"
						:agence="agence"
						:isAgenceSelected="agence.id == $store.getters.getUser.idAgenceSelected"
						@checkAgence="checkAgence"
						@editAgence="editAgence"
						@editSubscription = "editSubscription"
					/>
				</li>
			</ul>
			<div :class="classModal">
				<tunnel-create-agence 
					:initEtape = "etape"
					:agence="agence" 					
					@close="refresh"
					@checkAgence="checkAgence"
					 >
				</tunnel-create-agence>
			</div>
		<div class="modal is-active" v-if="addModalSubstription" >
		<div class="modal-background"></div>
		<div class="modal-card" style="background-color: white">
			<header class="modal-card-head">
					<p class="modal-card-title">
						Cliquez pour souscrire à un abonnement
					</p>
					<s-button theme="is-small"	icon="times-circle" 
						@onclick="addModalSubstription=false" label=""></s-button>&nbsp;
      
			</header>
			<section class="modal-card-body" style="overflow-x :hidden ;">
				<subscription agence="agence"  />
			</section>
		</div>
		</div>
	</div>

</template>
<script>
	import agence_api 			from '@/firebase/agence_api'	
	import user_api 			from '@/firebase/user_api'	
	
	import ItemAgence 			from '@/views/config/itemAgence.vue'	
	import TunnelCreateAgence 	from '@/views/config/tunnelCreateAgence.vue'
	import subscription 		from '@/views/config/step/subscription.vue'
	import subscription_api 	from '@/firebase/subscription_api'
	import firebase 			from "firebase"
	import firebase_api 		from '@/firebase/firebase_api'	

	export default {
		data: function() {
			return {
				agence: agence_api.api.json,
				agences: [],
				classModal: "modal",
				etape: 0,
				product: {},
				subscriptionBind: {},
				themeGoAccount : "is-primary",
				addModalSubstription: false,
				disabled: false
			}
		},
		components: {
			TunnelCreateAgence,
			ItemAgence,
			subscription
		},
		watch: {
			subscriptionBind: function(val, after) {
				
				if (typeof(val.subscription) != "undefined") {
					val.productRef.get().then(product=>{
                   	 	this.product = product.data();
					})
				}
			}
		},
		methods: {
			 addSubstription() {
				 this.addModalSubstription = true;
			 },
			 goAccount() {
					 this.themeGoAccount = "is-primary is-loading";
					 this.disabled = true;
					var subscription = firebase
						.app()
						.functions("europe-west1")
						.httpsCallable('ext-firestore-stripe-subscriptions-createPortalLink');
					subscription(
							{ returnUrl: window.location.origin + "/config" }
						)
						.then(function(result) {
							window.location.assign(result.data.url);
						})
						.catch(function(err) {
							console.log("Inside sendPushNotification error: " + err);
							console.log("Inside sendPushNotification error: " + JSON.stringify(err));
						})
						
			},
			editSubscription (agence) {
				this.agence = agence;
				this.etape = 6;
				this.classModal = "modal is-active";
			},
			checkAgence(agence) {
				var params = {
							idAgence: agence.id,
							fct: ()=>{								
								//fct(true);
							}
						}
				this.$store.dispatch("setAgence", params);
			},		
			getLabel(agenceSelected) {				
				if (agenceSelected)
						return 'Agence sélectionnée'
					else
						return 'Agence non sélectionnée'
			},
			editAgence(agence) {
				this.agence = agence;				
				if (this.agence.finish == this.$steps)
					this.etape = 0;
				else
					this.etape = this.agence.finish;
				
				if (this.classModal == "modal")
					this.classModal = "modal is-active";
				else
					this.classModal = "modal";
				
			},				
			createAgence() {
				this.agence= JSON.parse(JSON.stringify(agence_api.api.json));
				this.etape = 0;
				if (this.classModal == "modal")
					this.classModal = "modal is-active";
				else
					this.classModal = "modal";
			},			
			refresh() {				
				this.agences=[];
				agence_api.api.getAll(this.$store, agence=> {
					var agenceData = agence;
					this.agences.push(agence);
					this.classModal='modal'
				});
				var idUser = this.$store.getters.getUser.id;
				firebase_api.api.getDb().collection("subscription").doc(idUser).get().then(doc=>{
					if (doc.exists)
						this.$binding("subscriptionBind", firebase_api.api.getDb().collection("subscription").doc(idUser))
						.then(doc=>{})
				})
				
						
			}
		},
		mounted() {
			this.refresh();
		}
	}
</script>
<style scoped>
	
	.nextEtape {
		float:right;
	}
	.beforeEtape {
		float:left;
	}
	.subscription {
		border: thin solid black;
		padding: 10px;
		margin-bottom: 20px;
		margin-left: 5px;
		width: 350px;
		height: 180px;
		vertical-align: top;
	}
	.subscription div {
		display: inline-block;
	}
	.subscription .titleSubscription {
		border: none;
		font-weight: bolder;
	}
	.info {
		margin-left: 10px;
		font-style: italic;
		font-size: small;
	}
</style>