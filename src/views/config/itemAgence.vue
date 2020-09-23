<template>
	<div class="itemAgence">
		<span class="label">{{agence.nom}}
			<div style="float:right" v-if="isAgenceSelected">
				<s-button label="" theme="is-success is-small" icon="check"/>
			</div>
		</span>
		<div class="subscription" v-show="agence.finish==$steps">
				Crée par {{displayName}}
				<div v-if="subscriptionProduct!=''" >
					{{subscriptionProduct.name}}
				</div>				
		</div>
		<div class="checkAgence" v-show="!isAgenceSelected && agence.finish==$steps">
			<s-button @onclick="checkAgence(agence)" :icon="icon" :label="label" :theme="theme" /> 
		</div>
		
		<s-button  @onclick="editAgence(agence)" label="Configurer" :theme="theme" icon="edit">
			
		</s-button>
		
		<div class="checkAgence">
		<s-button v-show="isAgenceSelected && agence.finish==$steps" @onclick="$router.push('/list')" label="GO" :theme="theme" icon="play">
			
		</s-button>
		</div>
		<div style="margin-top: 5px">
			<router-link :to="{ name: 'DeleteAgence', params: { idAgence: agence.id } }">
				<s-button @onclick="" label="Supprimer" theme="is-danger" icon="trash">
				</s-button>
			</router-link>
		
		</div>
		<div  v-show="agence.finish!=$steps">
			<b>L'agence n'est pas finalisée. Vous êtes à l'étape {{agence.finish+1}}</b>
		</div>
		&nbsp;
		
	</div>
</template>
<script>
	import subscription_api from '@/firebase/subscription_api'
	import user_api from '@/firebase/user_api'
	import agence_api from '@/firebase/agence_api'
	import vuefire 			from "@/firebase/vuefire"
	export default {
		props: ["agence","label", "icon","theme","isAgenceSelected"],
		data() {
			return {
				subscriptionProduct: "",
				displayName: ""
			}
			
		},
		methods: {
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
			})
		}
	}
</script>
<style scoped>
	.itemAgence {
		width: 350px;
		height: 150px;
		border : thin silver solid; 
		margin-bottom: 10px;
		padding: 10px;
		margin-right: 5px;
		
	}
	.checkAgence {
		float: right;
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