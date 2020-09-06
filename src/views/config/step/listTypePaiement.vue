<template>
	<div class="contain">
		
			<s-button theme="is-primary" icon="plus" label="Ajouter un mode de paiement"  @onclick="AddTypePaiement"></s-button>&nbsp;&nbsp;<br/><br/>
			<s-button theme="is-primary" icon="info" label=""  @onclick="infoPaiement=!infoPaiement"></s-button>
			<div class="notification is-warning" v-show="infoPaiement">
				<button class="delete" v-on:click="infoPaiement=false"></button>
				Configurer les types de paiements de vos clients : en espèce, en chèque<br/>
				On vous demandera au moment de toper le paiement de vos clients
			</div>
			
			
			<ul >
				<li v-for="(typePaiement, index) in typePaiements">
					<input type="text" class="input" style="width:200px" v-model="typePaiement.libelle" placeholder="Mettre un libelle de paiement" />&nbsp;
					<s-button theme="is-primary" icon="trash" label="Supprimer" @onclick="deletePaiement(index)"></s-button>
					<br/><br/>
				</li>				
			</ul>
			<div class="notification is-danger" v-show="error">
			  <button class="delete" v-on:click="error=false"></button>
			  Il faut au moins un moyen de paiement !
			</div>
			
   <br/>
	</div>
</template>
<script>
import agence_api from '@/firebase/agence_api'
import user_api from '@/firebase/user_api'
import Vue from 'vue'
export default {
	data : function () {
		return {
			infoPaiement: false,
			typePaiements: [],
			error: false
		}
	},
	methods : {
		AddTypePaiement() {
			var paiement = {
				libelle: ""				
			}
			agence_api.api.AddTypePaiement(this.$store, paiement,()=>{
				this.typePaiements = this.$store.getters.getAgence.typePaiements;
			});
		},
		deletePaiement(index) {
			this.typePaiements.splice(index,1);
			this.save();
		},
		save(fct) {
			this.error = false;
			
			if (this.typePaiements.length > 0) { 
				agence_api.api.saveTypePaiement(this.$store, this.typePaiements,()=>{
					this.typePaiements = this.$store.getters.getAgence.typePaiements;
					fct(true);
				});
			}
			else {
				this.error = true;
				fct(false);
			}
		}

	},
	mounted() {
		if (typeof(this.$store.getters.getAgence.typePaiements) != "undefined") 
			this.typePaiements = this.$store.getters.getAgence.typePaiements;
		
	}
	
}
</script>