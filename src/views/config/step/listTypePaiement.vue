<template>
	<div class="contain">
			<input type="hidden" :value="refresh"/>
			<s-button theme="is-primary is-small" icon="plus" label="Ajouter "  @onclick="AddTypePaiement"></s-button>&nbsp;&nbsp;
			<s-button theme="is-primary is-small" icon="info" label=""  @onclick="infoPaiement=!infoPaiement"></s-button>
			<br/><br/>
			<div class="notification is-info" v-show="infoPaiement">
				<button class="delete" v-on:click="infoPaiement=false"></button>
				Configurer les types de paiements de vos clients : en espèce, en chèque, ...<br/>
				
			</div>
			
			<s-draggable :refresh="refreshDrag" draggable=".itemDraggable" :datas="dataCollectionArray" @sortData="sort">
			<div v-for="typePaiement in dataCollectionArray" class="itemDraggable">
				<div class="move">
					<i class="fas fa-arrows-alt-v"/>
				</div>
				<input type="text" class="input" style="width:200px" v-model="typePaiement.object.nom" placeholder="Mettre un libelle de paiement" />&nbsp;
				<s-button theme="is-danger is-small" icon="trash" label="" @onclick="deletePaiement(typePaiement.object.id)"></s-button>
					
			</div>
		</s-draggable>
			
			<div class="notification is-danger" v-show="error">
			  <button class="delete" v-on:click="error=false"></button>
			  Il faut au moins un moyen de paiement !
			  Le libellé est obligatoire
			</div>
			
   <br/>
	</div>
</template>
<style scoped>
	.itemDraggable {
		border: thin solid rgb(187, 184, 184);
		margin-bottom: 3px;
		margin-right: 5px;
		padding: 5px;
	}
	.itemDraggable:hover {
		cursor: grab
	}
	div.move {
		width: 5%;
		padding-top: 10px;
		display: inline-block;
	}
</style>
<script>
import agence_api from '@/firebase/agence_api'
import user_api from '@/firebase/user_api'
import Vue from 'vue'
export default {
	props:["agence","refresh"],
	data : function () {
		return {
			infoPaiement: false,
			error: false,
			refreshDrag: false,
			dataCollectionArray: []
		}
	},
	methods : {
		sort(myArray) {
				this.$updateRang(myArray, this.dataCollectionArray);
				this.refreshDrag = !this.refreshDrag;
		},
		AddTypePaiement() {
			var paiement = {
				nom: "",
				id: this.$uuid()				
			}
			this.agence.typePaiements[paiement.id] = paiement;
			this.dataCollectionArray = 	this.$orderJson(this.agence.typePaiements);
			this.$emit("refresh")	
		},
		deletePaiement(idPaiement) {
			delete this.agence.typePaiements[idPaiement];
			this.dataCollectionArray = 	this.$orderJson(this.agence.typePaiements);
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

	},
		mounted() {
			this.dataCollectionArray = 	this.$orderJson(this.agence.typePaiements);
		}
	
}
</script>