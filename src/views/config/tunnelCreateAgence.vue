<template><div class="tunnel">
	
<div class="modal-background"></div>
<div class="modal-card" style="height: 100%;background-color: white">
	<header class="modal-card-head">
      <p class="modal-card-title">
      	<span v-for="(iconEtap, index) in steps" class="iconStep">
      		<s-button label="" :theme="getTheme(index)" :icon="iconEtap.icon" @onclick="setEtape(index)"></s-button>      		
      	</span>
      	<br/><br/>
      	
  	  	<i :class="'fas fa-'+steps[etape].icon"></i>
      		&nbsp;&nbsp;{{steps[etape].label}}		
      	<div style="float:left;">
      	<s-button theme="is-danger is-small" icon="times-circle" @onclick="$emit('close')" label=""></s-button>&nbsp;
      	</div>
      		
  	  </p><br/>
  	  
	</header>
	
	<section class="modal-card-body" style="overflow-x :hidden ;">
		<div class="notification is-danger" v-show="errorFinish">
			<button class="delete" v-on:click="errorFinish=false"></button>
			Vous ne pouvez pas accèder aux différents paramètres.
			Il faut finaliser la création de l'agence.
			Cliquez sur suivant		  
		</div>	
		<div v-show="!errorFinish">
		<transition  :name="transition"  >
			<p  v-if="show" id="slide" >
				<edit-agence 		v-show="etape==0" :agence="agence" :steps="steps" ref="editAgence"></edit-agence>
				<list-categories	
					:agence="agence" 
					:refresh="refresh"
					 v-if="etape==1" 
					 @refresh="refresh=!refresh"
					 ref="listCategories"></list-categories>
		  		<list-entrepot 		
		  			v-if="etape==2"  
		  			:agence="agence"
		  			@hideNaviguation="hideNaviguation" 
		  			
		  			ref="listEntrepot"

		  			>
	  			</list-entrepot>
		  		<list-state :refresh="refresh"	 @refresh="refresh=!refresh" :agence="agence"	v-if="etape==3" ref="listEtat"></list-state>
		  		
		  		<list-type-paiement :agence="agence" :refresh="refresh"	 @refresh="refresh=!refresh"  v-if="etape==4" ref="typePaiement"></list-type-paiement>
		  		<manage-user 	:agence="agence" 	v-if="etape==5" ref="manageUser"></manage-user>
		  		<subscription :agence="agence" :save="saveSubscription"	:refresh="refresh"	v-if="etape==6" ref="subscription"></subscription>
		  	</p>
		</transition>
		</div>
	</section>

	<footer class="modal-card-foot">
		<div style="width:100%">
		<div class="beforeEtape" >
		  
		    <s-button theme="is-primary is-small" v-show="etape>0" afterIcon="save" icon="caret-left" label="Précédant" @onclick="beforeEtape">
				</s-button>
		 </div>
		 <div class="centerButton">
		    <s-button theme="is-success  is-small" v-show="true"  icon="save" label="Enregistrer" @onclick="termine">
				</s-button>
		  </div>
		  <div class="nextEtape">
		    <s-button theme="is-primary  is-small" v-show="etape<($steps-1)"  icon="save" afterIcon="caret-right" label="Suivant" @onclick="nextEtape">
				</s-button>
				<s-button theme="is-success  is-small" v-show="etape==($steps-1)"  icon="check" label="Terminé" @onclick="termine">
				</s-button><br/>
				
		  </div>
		  <div style="float:left">{{etape+1}} / {{$steps}}</b></div>
		</div>
		

	</footer>
</div>
</div>
</div>
</template>
<script>
import agence_api 		from '@/firebase/agence_api'	
import user_api			from "@/firebase/user_api"; 
import etat_api 		from '@/firebase/etat_api'	

import ListEntrepot 	from "@/views/config/step/listEntrepot.vue";
import ListState 		from "@/views/config/step/listStates.vue";
import ListCategories 	from "@/views/config/step/listCategories.vue";
import ManageUser 		from "@/views/config/step/manageUser.vue";
import ListTypePaiement from "@/views/config/step/listTypePaiement.vue";
import EditAgence 		from "@/views/config/step/editAgence.vue";
import Subscription     from "@/views/config/step/subscription.vue";
import firebase from "@/firebase/firebase_api";
export default {

	props:["agence","initEtape"],	
	components: {
			ListEntrepot,
			ListState,
			ListCategories,
			ManageUser,
			ListTypePaiement,
			EditAgence,
			Subscription
	},
	watch: {
		initEtape: function (val) {
			console.log(this.initEtape);
			if (this.agence.finish == this.$steps) {
				this.etape = this.initEtape;
			}
			else
				this.etape = this.agence.finish;
		}
	},
	data: function() {
			return {
				refresh: false,
				show: true,
				etape: 0,
				errorFinish: false,
				transition: 'fade',
				showButtonNaviguation: true,
				steps: [
					{
						icon: "warehouse",
						label: "Créer votre agence",
						description : "Saisir le nom de votre agence",
						ref: "editAgence"
					},
					{
						icon: "cogs",
						label: "Créer vos catégories",
						description : "Créer les catégories de vos articles",
						ref: "listCategories"
					},
					{
						icon: "industry",
						label: "Créer vos entrepots",
						description : "Créer vos entrepots",
						ref: "listEntrepot"
					},
					{
						icon: "th-list",
						label: "Créer vos états",
						description : "Créer les états de vos articles",
						ref: "listEtat"
					},
					
					{
						icon: "money-bill-wave-alt",
						label: "Créer vos types de paiement",
						description : "Créer vos types de paiements",
						ref: "typePaiement"
					},
					{
						icon: "user-plus",
						label: "Ajouter des utilisateurs",
						description: "Ajouter des utilisateurs",
						ref: "manageUser"
					},
					{
						icon: "money-check",
						label: "Abonnement",
						description: "Choisissez votre formule",
						ref: "subscription"

					}
				]
			}
	},			
	methods: {
		saveSubscription(abonnement) {
			this.agence.abonnement = abonnement;
			this.refresh=!this.refresh;
		},
		termine() {
			this.agence.finish = this.$steps;
			agence_api.api.updateFinish(this.agence);
			this.$emit('checkAgence', this.agence);
			this.$emit('close');
		},
		getTheme(index) {
			var theme = 'is-rounded is-small';
			if (index == this.etape)
				theme += ' is-success';
			else if ((index < this.etape) && ( this.agence.finish!= this.$steps)) {
					theme += ' is-warning';
			}
			else if ((index < this.agence.finish) && ( this.agence.finish== this.$steps)) 
				theme += ' is-primary'
			return theme;
		},
		
		hideNaviguation(hideOrShow) {
			this.showButtonNaviguation = hideOrShow;
		},
		setEtape(index) {
			if (this.agence.finish == this.$steps) {
				if (index != this.etape) {
					if (index > this.etape)
						this.transition = 'fadeOut';	
					else (index < this.etape)
						this.transition = 'fade';
					this.animation(()=>{
						this.etape = index;
					});				
				}
			}
			else {
				this.errorFinish = true;
			}
		},
		checkEtape(fct) {
			this.$refs[this.steps[this.etape].ref].save((ok)=>{
				if (ok) {
					fct();
					}
				})
			
		},
		save() {
			this.$refs[this.steps[this.etape].ref].save((ok)=>{

			})
		},
		nextEtape() {
			//console.log(this.$refs.editAgence.ref]);

			this.checkEtape(()=> {
				if (this.agence.finish != this.$steps) {
					this.agence.finish ++;
					agence_api.api.updateFinish(this.agence);
				}
				this.transition = 'fade';
				this.errorFinish = false;
				this.animation(()=>{
					
					this.etape ++;	
				});
			})
		},
		beforeEtape() {
			this.$refs[this.steps[this.etape].ref].save((ok)=>{
				if (this.agence.finish != this.$steps) {
					this.agence.finish--;
					agence_api.api.updateFinish(this.agence);
				}
				this.transition = 'fadeOut';
				this.errorFinish = false;
				this.animation(()=>{
					this.etape --;	
				});
			});
		},
		animation(fct) {
			setTimeout(()=>{
				this.show = false;	
			}, 10);
			setTimeout(()=>{
			   this.show = true;
			   fct();
			},1000);
		}	
	}
}
</script>
<style scoped>

	.fade-leave-active,
	.fade-enter-active {
	  transition: 1s;
	}
	.fade-enter {
		transform: translate(100%,0);	
	}
	.fade-leave-to {
	  transform: translate(-100%, 0);
	}


	.fadeOut-leave-active,
	.fadeOut-enter-active {
	  transition: 1s;
	}
	.fadeOut-enter {
		transform: translate(-100%,0);	
	}
	.fadeOut-leave-to {
	  transform: translate(100%, 0);
	}

	.tunnel {
		height: 100%;
		width: 100%;
		overflow-x :hidden ;
	}
	.nextEtape {
		width: 33%;
		display: inline-block;
		text-align:right;
	}
	.beforeEtape {
		width: 33%;
		display: inline-block;

	}
	.centerButton {
		 width: 33%;
		 display: inline-block;
		text-align:center;
	}
	.iconStep {
		margin-left: 3px;
	}
	.trash {
		margin-left: 10px;
	}
</style>