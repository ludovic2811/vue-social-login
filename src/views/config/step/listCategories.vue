<template>
	<div>
		<br/>
		
		<s-button  theme="is-primary" label="Ajouter une categorie" icon="plus" @onclick="addCategorie"></s-button><br/><br/>
		<s-draggable :refresh="refreshDrag" draggable=".itemDraggable" :datas="dataCollectionArray" @sortData="sort">
		    <div v-for="categorie in dataCollectionArray" :key="categorie.id" class="itemDraggable" >
		        <i class="fas fa-arrows-alt-v"/>
				
				<div class="itemCategory">
					<i :class="categorie.object.icon"/>
					&nbsp;{{categorie.object.nom}}	
				</div>
				<s-button theme="is-primary" label="" icon="cog" @onclick="editCategorie(categorie.id)"/>
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
				  <div class="notification is-info" v-show="infoType">
					  <button class="delete" v-on:click="infoType=false"></button>
					  Un type vous permet de définir le prix et l'espace pris par défaut pour une taille ou pour un autre critère d'une catégorie de véhicule...<br/>
					  Par exemple, une caravane de type "Petite" a un prix de 150 € prend une place de 0,5.<br/>
					  Seul le prix pourra être redéfini par client.
				 </div>
				 <div class="notification is-danger" v-show="errorCategorie.type">
					  <button class="delete" v-on:click="errorCategorie.type=false"></button>
					  Le nom et le prix doivent être saisis.
					  Le prix doit être un montant !
				</div>
				<div class="head">
					<div class="move"></div>
					<div class="nom">Nom</div>
					<div class="prix">Prix à l'année</div>
					<div class="place">Espace pris</div>
					
				</div>
				 <s-draggable :refresh="refreshDragType" draggable=".itemDraggableType" 
				 			:datas="dataCollectionArrayTypes" @sortData="sortType">
					<div v-for="type in dataCollectionArrayTypes"  :key="type.id" class="itemDraggableType">
						<div class="move">
							<i class="fas fa-arrows-alt-v"/>
						</div>
						<div class="nom">
						<input type="text"  class="input is-rounded" v-model="type.object.nom" placeholder="Mettre le nom du type" />
						</div>
						<div class="prix">
						<span class="control has-icons-left">
								<input type="number"  class="input is-rounded" v-model="type.object.prix"  placeholder="Prix par défaut"/>
								<span class="icon is-small is-left">
								<i class="fas fa-euro-sign"></i>
							    </span>	&nbsp;    
						</span> 
						</div>
						<div class="place">
						<input type="number" placeholder="Nb place" v-model="type.object.espace" class="input is-rounded"style="width:100%" />
						</div>
						<div class="trash">
						<s-button icon="trash" label="" theme="is-small is-danger" @onclick="deleteType(type.object.id)"/>
						</div>
					</div>
				</s-draggable>
				
				  <div class="notification is-danger" v-show="errorCategorie.nbType">
					  <button class="delete" v-on:click="errorCategorie.nbType=false"></button>
					  Il faut au moins un type !
				</div>
				  
				  <div class="notification is-danger" v-show="errorNbArticles">
					  <button class="delete" v-on:click="errorNbArticles=false"></button>
					  Il existe des véhicules pour ce type de catégorie
				</div>
				</section>
				<footer class="modal-card-foot">
				  <div  style="width:100%">
				  <s-button  theme="is-danger is-small"  icon="trash" label=""  @onclick="deleteCategorie"></s-button>
				  <div style="float:right">
				  <s-button  theme="is-warning  is-small"  icon="ban" label="Annuler"  @onclick="modalEditCategorie='modal'"></s-button>
				  <s-button  theme="is-success  is-small" icon="save" label="Enregistrer"  @onclick="saveCategorie"></s-button>
				  </div>
				  </div>
				</footer>
			</div>
		</div>
	</div>
</template>
<style scoped>
	.arrayType {
		width: 100%;
		
	}
	.arrayType tr th {
		
		text-align: center;
	}
	div.nom {
		width: 25%;
		text-align: center;
		
	}
	div.prix {
		width: 33%;
		text-align: center;
		
	}
	div.place {
		width: 22%;
		text-align: center;
		
	}
	
	div.trash {
		width: 5%;
		margin-top: 5px;
		margin-left: 50px;
	}
	div.move {
		width: 5%;
		padding-top: 10px;
	}
	div.move button:hover{
		cursor:move;
	}
	.itemCategory {
		display: inline-block;
		margin-top: 10px;
		width: 150px;
		padding-left: 15px;
	}
	.itemDraggable {
		border: thin solid rgb(187, 184, 184);
		margin-bottom: 3px;
		margin-right: 5px;
		padding: 5px;
	}
	.itemDraggableType {
		border: thin solid rgb(187, 184, 184);
		margin-bottom: 3px;
		margin-right: 5px;
		padding: 5px;
	}
	.itemDraggable:hover {
		cursor: grab
	}
	.itemDraggableType:hover {
		cursor: grab
	}
	.itemDraggable:hover {
		cursor: grab
	}
	.itemDraggableType:hover {
		cursor: grab
	}
	
	.itemDraggableType div {
		display: inline-block;
		height: 40px;
		vertical-align: top;
		padding-left: 5px;
		
	}
	.head div {
		display: inline-block;
		height: 40px;
		vertical-align: top;
		padding-left: 5px;
		font-weight: bolder;
	}
</style>
<script>
	import categorie_api from '@/firebase/categorie_api'
	import library_icons from "@/firebase/library_icon"
	
	export default {
		props: ["agence", "refresh"],		
		data: function() {
			return {
				dataCollectionArray: [],
				dataCollectionArrayTypes: [],
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
				refreshDrag: false,
				refreshDragType: false,
				errorNbArticles: false
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
			sortType(myArray) {
				this.$updateRang(myArray, this.dataCollectionArrayTypes);
				this.refreshDragType = !this.refreshDragType;
			},
			setIcon(item) {
				
				this.categorie.icon = item.object.value;
			},
			newType() {
				var type= JSON.parse(JSON.stringify(this.type));
				type.id = this.$uuid();
				this.categorie.types[type.id]  = type;
				this.dataCollectionArrayTypes = this.$orderJson( this.categorie.types);
				this.$emit("refresh");
			},
			deleteType(idType) {
				if (this.categorie.types[idType].nbArticles != 0)
					this.errorNbArticles = true;
				else {
					delete this.categorie.types[idType];
					this.errorNbArticles = false;
					this.dataCollectionArrayTypes = this.$orderJson( this.categorie.types);
				}
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
				this.categorie = this.agence.categories[idCategorie];
				this.dataCollectionArrayTypes = this.$orderJson(this.agence.categories[idCategorie].types);
				this.modalEditCategorie='modal is-active';
			},
			addCategorie() {				
				this.categorie = JSON.parse(JSON.stringify(categorie_api.api.json_categorie));
				this.categorie.id = this.$uuid();
				this.dataCollectionArrayTypes = [];
				this.modalEditCategorie='modal is-active';
			},
			deleteCategorie() {
				var deleteCategorie = true;
				for (var key in this.categorie.types) {
					if (this.categorie.types[key].nbArticles != 0)
						deleteCategorie = false;
				}
				if (deleteCategorie)
					categorie_api.api.delete(this.agence, this.categorie, ()=>{
						this.modalEditCategorie='modal';
					});
				else
					this.errorNbArticles  = true;
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
