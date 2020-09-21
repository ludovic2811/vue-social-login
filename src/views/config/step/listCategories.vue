<template>
	<div>
		<br/>
		
		<s-button  theme="is-primary" label="Ajouter une categorie" icon="plus" @onclick="addCategorie"></s-button><br/><br/>
		<s-draggable :refresh="refreshDrag" draggable=".itemDraggable" :datas="dataCollectionArray" @sortData="sort">
		    <div v-for="categorie in dataCollectionArray" :key="categorie.id" class="itemDraggable">
		        <s-button theme="is-primary" label="" icon="cog" @onclick="editCategorie(categorie.id)"/>
				<div class="itemCategory">
					<i :class="categorie.object.icon"/>
					&nbsp;{{categorie.object.nom}}	
				</div>
				<s-button theme="" label="" icon="arrows-alt" @onclick=""/>
				 <br/><br/>
		    </div>
		    
		</s-draggable>
		<div class="notification is-danger" v-show="error">
		  <button class="delete" v-on:click="error=false"></button>
		  Il faut au moins une catégorie
		</div>
		<div :class="modalEditCategorie">
			<div class="modal-background"></div>
			<div class="modal-card">
				<header class="modal-card-head">
				  <p class="modal-card-title">Editer la catégorie</p>
				 
				</header>
				<section class="modal-card-body">
				  <!-- Content ... -->
				  
				  <label class="label">
				  	Nom : 
				  </label>
				 
				  <input type="hidden"  v-model="categorie.icon"/>
				  
				  <input type="text" class="input" v-model="categorie.nom" placeholder="Mettre un nom de catégorie (ex: caravane"/><br/>
				  <div class="notification is-danger" v-show="errorCategorie.nom">
					  <button class="delete" v-on:click="errorCategorie.nom=false"></button>
					  Le nom de la catégorie est obligatoire !
				</div>

				  <br/>
				  <label class="label">
				 	Icone :
				  </label>
				 	

				   <s-select :list="iconsArticles" 
				   		:valueSelected="categorie.icon" 
					    :fields="fields" 
						@selected="setIcon" 
						labelNotSelected="Selectionner"/>
				   <br/><br/>
				   <div class="notification is-danger" v-show="errorCategorie.icon">
					  <button class="delete" v-on:click="errorCategorie.icon=false"></button>
					  Sélectionner une icone pour votre catégorie !
				</div>
				    <label class="label">Liste des types:</label>
				  <s-button theme="is-primary"  label="Ajouter un type" icon="plus" @onclick="newType"/>
				  &nbsp;
				  <s-button theme="is-primary"  label="" icon="info" @onclick="infoType=true"/>
				  <br/><br/>
				  <div class="notification is-warning" v-show="infoType">
					  <button class="delete" v-on:click="infoType=false"></button>
					  Un type vous permet de définir le prix par défaut par une taille ou pour autre critère ...<br/>
					  Par exemple, une caravane de type "Petite" a un prix de 150 €.<br/>
					  <b>Attention : Si le champ figé est coché, le prix ne pourra pas être spécifique pour un article donné.
					  Si il n'est pas coché vous pourrez redéfinir un prix pour un article et pour un client donné</b>
				 </div>
				 <div class="notification is-danger" v-show="errorCategorie.type">
					  <button class="delete" v-on:click="errorCategorie.type=false"></button>
					  Le nom et le prix doivent être saisis.
					  Le prix doit être un montant !
				 </div>
				 <table class="arrayType">
				 		<tr>
				 			<th>Nom</th>
				 			<th>Prix</th>
				 			<th>Figé</th>
				 			<th>Place </th>
				 			<th></th>
				 		</tr>
				  		<tr v-for="type in categorie.types">
				  			<td class="nom">
				  			 <input type="text"  class="input is-rounded" style="width:100%" v-model="type.nom" placeholder="Mettre le nom du type" />
				  			 </td>
				  			 <td class="prix">
				  			 <span class="control has-icons-left has-icons-right">
								<input type="number" style="width:100%" class="input is-rounded" v-model="type.prix"  placeholder="Prix par défaut"/>
								<span class="icon is-small is-left">
								<i class="fas fa-euro-sign"></i>
							    </span>	&nbsp;	
							    				    
							</span> 
				  			</td>
				  			<td class="fige">
				  				<input type="checkbox" v-model="type.fige"/>	
				  			</td>
							<td colspan="2" class="espace">
								<input type="number" placeholder="Nb place" v-model="type.espace" class="input is-rounded"style="width:100%" />							
							</td>
							<td class="trash">
								<s-button icon="trash" label="" theme="is-small is-danger" @onclick="deleteType(type.id)"/>
							</td>
				  		</tr>
				  </table>
				  <div class="notification is-danger" v-show="errorCategorie.nbType">
					  <button class="delete" v-on:click="errorCategorie.nbType=false"></button>
					  Il faut au moins un type !
				</div>
				  
				</section>
				<footer class="modal-card-foot">
				  <s-button  theme="is-success" icon="save" label="Enregistrer"  @onclick="saveCategorie"></s-button>
				  <s-button  theme="is-warning"  icon="ban" label="Annuler"  @onclick="modalEditCategorie='modal'"></s-button>
				  <s-button  theme="is-danger"  icon="trash" label="Supprimer"  @onclick="deleteCategorie"></s-button>
				</footer>
			</div>
		</div>
	</div>
</template>
<script>
	import categorie_api from '@/firebase/categorie_api'
	import library_icons from "@/firebase/library_icon"
	
	export default {
		props: ["agence", "refresh"],		
		data: function() {
			return {
				dataCollectionArray: [],
				fields: ['label', 'value', 'icon'],
				categorie: categorie_api.api.json_categorie,
				type: categorie_api.api.json_type,
				iconsArticles: library_icons.iconsArticles,
				modalEditCategorie: "modal",
				errorCategorie: {
					nbType: false,
					nom: false,
					icon: false,
					type: false
				},
				infoType: false	,
				error: false,
				refreshDrag: false		
			}
		},
		watch: {
			refresh: function(val) {
				this.dataCollectionArray = 	this.$orderJson(this.agence.categories);
			}
		},
		methods: {  
			sort(myArray) {
				this.$updateRang(myArray, this.dataCollectionArray);
				this.refreshDrag = !this.refreshDrag;
			},
			setIcon(item) {
				
				this.categorie.icon = item.object.value;
			},
			newType() {
				var type= JSON.parse(JSON.stringify(this.type));
				type.id = this.$uuid();
				this.categorie.types[type.id]  = type;
				this.$emit("refresh");
			},
			deleteType(idType) {
				delete this.categorie.types[idType]
			},
			
			saveCategorie() {
				this.errorCategorie.nom  = this.categorie.nom == ""				
				this.errorCategorie.icon = this.categorie.icon == ''
				var nbTypes = 0;
				this.errorCategorie.type = false;
				for (var key in this.categorie.types) {
					this.errorCategorie.type = (this.categorie.types[key].nom == "") || this.errorCategorie.type;
					this.errorCategorie.type = (this.categorie.types[key].prix == "") || this.errorCategorie.type;
					nbTypes++;		
				}
				this.errorCategorie.nbType = nbTypes == 0	
				var error = this.errorCategorie.nom  || this.errorCategorie.nbType || this.errorCategorie.icon || this.errorCategorie.type;
				
				if (!error) {					
					categorie_api.api.save (this.agence, this.categorie, ()=>{
					
						this.$emit("refresh");
						this.modalEditCategorie='modal';
					})
				}
			},
			editCategorie(idCategorie) {
				this.categorie = this.agence.categories[idCategorie]
				this.modalEditCategorie='modal is-active';
			},
			addCategorie() {				
				this.categorie = JSON.parse(JSON.stringify(categorie_api.api.json_categorie));
				this.categorie.id = this.$uuid();
				this.modalEditCategorie='modal is-active';
			},
			deleteCategorie() {

				categorie_api.api.delete(this.agence, this.categorie, ()=>{
					this.modalEditCategorie='modal';
				});
			},
			save(fct) {
				this.error = false;
				if (Object.keys(this.agence.categories).length > 0)
					fct(true)
				else {
					this.error = true;
					fct(false)
				}
			}
		},
		mounted() {
			this.dataCollectionArray = 	this.$orderJson(this.agence.categories);
		}
	}
</script>
<style scoped>
	.arrayType {
		width: 100%;
		
	}
	.arrayType tr th {
		
		text-align: center;
	}
	.arrayType tr td.nom {
		width: 35%;
		text-align: center;

	}
	.arrayType tr td.prix {
		width: 30%;
		text-align: center;
		
	}
	.arrayType tr td.place {
		width: 25%;
		text-align: center;
		
	}
	.arrayType tr td.fige {
		width: 5%;
		text-align: center;
		padding-top: 10px;
	}
	.arrayType tr td.trash {
		width: 5%;
		text-align: center;
		
	}
	.itemCategory {
		display: inline-block;
		margin-top: 10px;
		width: 150px;
		padding-left: 15px;
	}
</style>