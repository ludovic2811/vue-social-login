<template>
	<div   class="contain"><br/>
		<input type="hidden" :value="refresh"/>
		<s-button theme="is-primary is-small" icon="plus" label="Ajouter"  @onclick="addEtat"></s-button>&nbsp;&nbsp;
		<s-button theme="is-primary is-small" icon="info" label=""  @onclick="infoEtat=!infoEtat"></s-button>
		<br/><br/>
		<div class="notification is-info" v-show="infoEtat">
			<button class="delete" v-on:click="infoEtat=false"></button>
			Vous devez configurer les états des véhicules.<br/>
			N'oubliez pas d'attribuer un icone pour votre état.<br/>
			Si vous cochez le champ "Sorti", cela signigie que vous considérez que le véhicule (positionné sur cet état) n'est plus dans vos entrepots
		</div>
		<s-draggable :refresh="refreshDrag" draggable=".itemDraggable" :datas="dataCollectionArray" @sortData="sort">
			<div v-for="etat in dataCollectionArray" class="itemDraggable">
				
				<div class="move">
					<i class="fas fa-arrows-alt-v"/>
				</div>
				<s-select :list="iconsEtats" :valueSelected="etat.object.icon" :change="etat" attributChange="icon" :fields="fields" @selected="setEtat(etat)" labelNotSelected="Icon"/>
				&nbsp;&nbsp;
				<input type="text"class="input is-rounded" v-model="etat.object.nom" style="width:100px" placeholder="Libelle" />
				&nbsp;&nbsp;<input type="hidden" v-model="etat.object.icon"/>
				<div style="align-text:center;font-size:10px;display:inline-block;width: 29px;margin-right:2px">
					Sorti ?<br/>
				
				<input type="checkbox" class="checkbox" v-model="etat.object.out"/>
				
				</div>
				<div style="float:right">
				<s-button theme="is-danger is-small" icon="trash" label="" @onclick="deleteEtat(etat.object.id)"></s-button>
				</div>
			</div>
		</s-draggable>
		
		<div class="notification is-danger" v-show="error">
	      <button class="delete" v-on:click="error=false"></button>
	      Il faut au moins un état !
	      Leur nom est oblitaoire !
	    </div>
		<div class="notification is-danger" v-show="errorNbArticles">
	      <button class="delete" v-on:click="errorNbArticles=false"></button>
	     	Impossible de supprimer cet état.
			Il existe encore des véhicules topés sur cet état !<br/>
			 
		</div>
	
	
		
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
	import etat_api from '@/firebase/etat_api'
	
	import library_icons from "@/firebase/library_icon"
	export default {
		props : ["agence","refresh"],
		data: function() {
			return {
				fields: ['label', 'value', 'icon'],				
				iconsEtats: library_icons.iconsEtats,				
				infoEtat: false,
				error: false,
				dataCollectionArray: [],
				refreshDrag: false,
				errorNbArticles : false
			}
		},
		methods: {  
			setEtat(etat) {
				
				this.agence.etats[etat.id].icon = etat.icon;
				this.dataCollectionArray = 	this.$orderJson(this.agence.etats);
			},
			sort(myArray) {
				this.$updateRang(myArray, this.dataCollectionArray);
				this.refreshDrag = !this.refreshDrag;
			},
			addEtat() {
				var etat =  JSON.parse(JSON.stringify(etat_api.api.json_etat));
				etat.id = this.$uuid();
				this.agence.etats[etat.id] = etat;
				this.dataCollectionArray = 	this.$orderJson(this.agence.etats);
				this.$emit("refresh");
							
			},
			deleteEtat(idEtat) {
				if (this.agence.etats[idEtat].nbArticles != 0)
					this.errorNbArticles = true;
				else
					etat_api.api.delete(this.agence, idEtat,()=>{
						
					});
			},
			save(fct) {
				this.error = false;
				
				var nb=0;
				
				for (var key in this.agence.etats) {					
					this.error =  this.agence.etats[key].nom =="" || this.error					
					nb++;
				}
				if (nb==0)
					this.error = true;
				if (!this.error)
					etat_api.api.save(this.agence, ()=>{
						fct(true);
					});	
				else
					fct(false);
				
				
			}
		}
		,
		mounted() {
			this.dataCollectionArray = 	this.$orderJson(this.agence.etats);
		}
	}
</script>