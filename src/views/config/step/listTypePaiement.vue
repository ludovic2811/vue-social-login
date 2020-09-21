<template>
	<div class="contain">
			<input type="hidden" :value="refresh"/>
			<s-button theme="is-primary" icon="plus" label="Ajouter "  @onclick="AddTypePaiement"></s-button>&nbsp;&nbsp;
			<s-button theme="is-primary is-small" icon="info" label=""  @onclick="infoPaiement=!infoPaiement"></s-button>
			<br/><br/>
			<div class="notification is-warning" v-show="infoPaiement">
				<button class="delete" v-on:click="infoPaiement=false"></button>
				Configurer les types de paiements de vos clients : en espèce, en chèque<br/>
				
			</div>
			
			
			<ul >
				<li v-for="typePaiement in agence.typePaiements">
					<input type="text" class="input" style="width:200px" v-model="typePaiement.nom" placeholder="Mettre un libelle de paiement" />&nbsp;
					<s-button theme="is-primary" icon="trash" label="Supprimer" @onclick="deletePaiement(typePaiement.id)"></s-button>
					<br/><br/>
				</li>				
			</ul>
			<div class="notification is-danger" v-show="error">
			  <button class="delete" v-on:click="error=false"></button>
			  Il faut au moins un moyen de paiement !
			  Le libellé est obligatoire
			</div>
			
   <br/>
	</div>
</template>
<script>
import agence_api from '@/firebase/agence_api'
import user_api from '@/firebase/user_api'
import Vue from 'vue'
export default {
	props:["agence","refresh"],
	data : function () {
		return {
			infoPaiement: false,
			error: false
		}
	},
	methods : {
		AddTypePaiement() {
			var paiement = {
				nom: "",
				id: this.$uuid()				
			}
			this.agence.typePaiements[paiement.id] = paiement;
			this.$emit("refresh")	
		},
		deletePaiement(idPaiement) {
			delete this.agence.typePaiements[idPaiement];
			this.$emit("refresh")		
		},
		save(fct) {
			this.error = false;
			var nb=0;
				for (var key in this.agence.typePaiements) {
					this.error =  this.agence.typePaiements[key].nom =="" || this.error
					nb++;
				}
				if (nb==0)
					this.error = true;
				if (!this.error)
					agence_api.api.saveTypePaiement(this.agence, ()=>{
						fct(true);
					});	
				else
					fct(false);
		}

	}
	
}
</script>