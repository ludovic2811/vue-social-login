<template>
	<div class="container">
		
		<div :class="classModalOpenAddAgence">
			<div class="modal-background"></div>
  			<div class="modal-card">
	    		<header class="modal-card-head">
				      <p class="modal-card-title">Ajouter une agence</p>
					  	
						  
				      <div style="float:rigth" >
				      	<s-button theme="" label="" icon="times-circle" @onclick="classModalOpenAddAgence='modal'"/>
				      </div>

				</header>
				<section class="modal-card-body">
					<div style="text-align:center">
					<div class="classChoiceAdd" v-on:click="createAgence()">
						<i class="fas fa-object-ungroup"></i>
						<br/>	Vide
					</div>
					<div  class="classChoiceAdd" v-on:click="createAgenceByModel()">
						<i class="fas fa-object-group"></i>
						<br/>A partir d'un modèle
					</div>
					</div>
				</section>
  			</div>
		</div>


			<div v-if="subscriptionBind.subscription">
			<my-navbar ></my-navbar>
			<div v-if="subscriptionBind.subscription.status!='test'">
			<div :class="subscriptionBind.subscription.status=='active' ? 'subscription' : 'subscriptionCanceled'" v-if="subscriptionBind.subscription" >
				<div>
					
					<div class="titleSubscription" >
					<img v-if="product.images" :src="product.images[0]" style="width=40px;height:40px;"/> 
					<div class="product">{{product.name}}</div>
					<div style="float:right" v-if="product.name!='aucun'">
						<s-button 
							:theme="subscriptionBind.subscription.status=='active' ? 'is-success is-small' : 'is-danger is-small'"
							:label="subscriptionBind.subscription.status=='active' ? 'Activé' : 'Annulé'"
							:icon="subscriptionBind.subscription.status=='active' ? 'check' : 'ban'"
							disabled="true">
						</s-button>
					</div>
					</div>
					
					<div v-if="product.name!='aucun'" >
						<br/>
						<span v-show="subscriptionBind.subscription.status=='active'">
							Votre abonnement vous limite à {{product.limit}} clients pour toutes vos agences
						</span>
						<span v-show="subscriptionBind.subscription.status!='active'">
						 	<b>Votre compte sera réinitialisé et vos agences seront supprimées dans quelques jours</b>
						</span>
					</div>
				
				</div>
				
				
				
				<div class="footerSubscribe">
					<div class='info'>
							Si vous venez d'effectuer un changement sur votre abonnement, veuillez patientez ...
					</div>
					
				</div>
				<div class="buttons">
						<s-button label="Visualiser" v-if="subscriptionBind.subscription.status=='active'"
							:theme="themeGoAccount" :disabled="disabled" icon="eye" @onclick="goAccount()"/>
						
						<s-button 
							label="Renouveler" theme="is-success" icon="sync" @onclick="addSubstription()"  
							v-if="subscriptionBind.subscription.status=='canceled'"/>
						
					</div>
			</div>
			</div>
			
			<div class="subscription" v-if="subscriptionBind.subscription.status=='test'" >
					<br/>
					Vous n'avez aucun abonnement. <br/>Vous êtes en mode test limité à 5 clients
					<br/>
					<s-button 
						label="Abonnez vous" theme="is-success" icon="plus" @onclick="addSubstription()" />
					<div class='info'>
					Si vous venez de résilier ou d'ajouter un abonnement, veuillez patientez quelques secondes pour la mise à jour ... 
					</div>
			</div>
			<s-button 
			:disabled="subscriptionBind.subscription.status!='active' && subscriptionBind.subscription.status!='test'"
			@onclick="classModalOpenAddAgence='modal is-active'" icon="plus" label="Nouvelle agence" theme="is-primary">
			</s-button>
			<br/><br/>
			<ul>
				<li v-for="agence in agences" v-if="subscriptionBind.subscription.status=='active' ||  subscriptionBind.subscription.status=='test'">
					<item-agence 
						:label="(agence.id == $store.getters.getUser.idAgenceSelected) ? 'Sélectionnée' : 'Sélectioner'" 
						:icon="(agence.id == $store.getters.getUser.idAgenceSelected) ? 'check' : 'ban'"
						:theme="(agence.id == $store.getters.getUser.idAgenceSelected) ? 'is-primary is-small' : 'is-danger is-small'"
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
						Soubscription d'abonnement
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
		
	</div>

</template>
<script>
	import agence_api 			from '@/firebase/agence_api'	
	import user_api 			from '@/firebase/user_api'	
	import vuefire 			from "@/firebase/vuefire"
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
				subscriptionBind: {
						subscription : {
							status: "test"
						}
					}
				,
				themeGoAccount : "is-primary",
				addModalSubstription: false,
				disabled: false,
				classModalOpenAddAgence: "modal"
			}
		},
		components: {
			TunnelCreateAgence,
			ItemAgence,
			subscription
		},
		watch: {
			subscriptionBind: function(val, after) {
				
				if (val.length != 0)
					if (typeof(this.subscriptionBind.subscription) != "undefined") {
						if (this.subscriptionBind.subscription.status != "test") {
							
							this.subscriptionBind.productRef.get().then(product=>{
								this.product = product.data();
							})
						}
					}
			}
		},
		methods: {			 
			 addSubstription() {
				this.addModalSubstription = "modal is-active";
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
				//console.log(JSON.stringify(this.agence));		
				// juste pour créer un modèle 
				//firebase_api.api.getDb().collection("agence").doc("modele").set(this.agence);
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
				this.classModalOpenAddAgence = "modal";
				if (this.classModal == "modal")
					this.classModal = "modal is-active";
				else
					this.classModal = "modal";
			},	
			createAgenceByModel() {
				agence_api.api.createAgenceByModel(this.$store,()=>{
					this.classModalOpenAddAgence = "modal";
					this.refresh();
				});
			},	
			refresh() {		
				if (this.$store.getters.getUser != null)		 {
					this.agences=[];
					agence_api.api.getAll(this.$store, agence=> {
						var agenceData = agence;
						this.agences.push(agence);
						this.classModal='modal'
					});
					var idUser = this.$store.getters.getUser.id;
					
					firebase_api.api.getDb().collection("subscription").doc(idUser).get().then(doc=>{

						if (doc.exists) {
							console.log("bingind");
							this.$binding("subscriptionBind", firebase_api.api.getDb().collection("subscription").doc(idUser))
							.then(doc=>{
								console.log(doc);
							})
						}
							
					})
				} else {
					vuefire.store.dispatch('init', ()=>{
						this.refresh();
					});
				}
						
			}
		},
		beforeMount () {
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
		border: thin solid rgb(175, 173, 173);
		background-color: beige;
		padding: 5px;
		margin-bottom: 20px;
		margin-left: 5px;
		width: 70%;
		min-width: 310px;
		height: 200px;
		vertical-align: top;
	}
	.subscriptionCanceled {
		border: thin solid rgb(110, 5, 5);
		background-color: rgb(243, 198, 198);
		padding: 5px;
		margin-bottom: 20px;
		margin-left: 5px;
		width: 70%;
		min-width: 310px;
		height: 200px;
		vertical-align: top;
		color: rgb(104, 7, 7)
	}

	.titleSubscription {
		border: none;
		font-weight: bolder;
		
	}
	.info {
		font-size: small;
		font-style:italic;
		width: 100%;
		text-align: left;
	}
	.footerSubscribe {
		margin-top: 5px;
		
	}
	div.buttons {
		display: inline-block;
		text-align: right;
		float: right;
		vertical-align: bottom;
		
	}
	.product {
		display: inline-block;
		padding-left: 10px;
		height: 50px;
		padding-top: 10px;
		vertical-align: top;
		font-size: large;
		color: black;
	}
	.classChoiceAdd {
		 box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
		 display: inline-block;
		 width: 160px;
		 height: 100px;
		 text-align: center;
		 vertical-align: middle;
		 font-weight: bolder;
		 padding-top: 5px;
		 margin-right: 50px;
		 margin-top: 30px;
		 margin-bottom: 30px;
		 font-size: 20px;
	}
	.classChoiceAdd:hover {
		cursor: pointer;
		background-color: rgb(218, 238, 187);
		
	}
</style>