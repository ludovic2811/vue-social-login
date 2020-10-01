<template>
<div class="contain">
	<div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Editer la catégorie</p>
         
        </header>
        <section class="modal-card-body">

	
		<span class="label">
    		Nom de l'entrepot :
    	</span>
    	<input type="hidden" :value="refresh"></input>
    	<input type="text" class="input" placeholder="Nom de l'entrepot" v-model="entrepot.nom"/>
    	<div class="notification is-danger" v-show="errorEntrepot.nom">
				<button class="delete" v-on:click="errorEntrepot.nom=false"></button>
				 Le nom de l'entrepot est obligatoire
		</div>
    	<br/><br/>    	
    	<span class="label">
    	Lieux de stockage
    	</span>
		<div style="padding-bottom: 5px">
			<s-button icon="plus" theme="is-primary is-small" label="Ajouter"  @onclick="addStock"></s-button>&nbsp;
			<s-button icon="info" theme="is-primary is-small" label=""  @onclick="infoEntrepot=true"></s-button>
		</div>
    	<div class="notification is-info" v-show="infoEntrepot">
			<button class="delete" v-on:click="infoEntrepot=false"></button>
			Un lieu de stockage est l'emplacement où vous allez stocker les véhicules de vos clients.
			 <br/> 
			 Vous devez définir une capacité de stockage
		</div>
		
    	<div class="listStock">
			 <s-draggable :refresh="refreshDrag" draggable=".itemDraggable" :datas="dataCollectionArray" @sortData="sort">
				<div  v-for="stock in dataCollectionArray" class="itemDraggable" >
				<div style="padding-top:5px;display:inline-block;"> <i class="fas fa-arrows-alt-v"/></div>&nbsp;&nbsp;
				<input type="text" class="input is-rounded"  style="width:200px" v-model="stock.object.nom" placeholder="Nom du lieu de stockage"/>
    			&nbsp;&nbsp;<input type="number" class="input is-rounded"  style="width:100px" v-model="stock.object.capacite" placeholder="Capacite" />
    			&nbsp;&nbsp;
    			<s-button  theme="is-danger" icon="trash" label=""  @onclick="deleteStock(stock.object.id)"></s-button>
    			
				 </div>
			 </s-draggable>
    	</div>
		<div class="notification is-danger" v-show="errorEntrepot.nbstock">
				<button class="delete" v-on:click="errorEntrepot.nbstock=false"></button>
				Il faut au moins un lieu de stockage !
		</div>
    	<div class="notification is-danger" v-show="errorEntrepot.stock">
				<button class="delete" v-on:click="errorEntrepot.stock=false"></button>
				 Le nom d'un lieu de stockage est obligatoire et sa capacité doit être supérieur à 0 !
		</div>
		<div class="notification is-danger" v-show="errorDeleteEntrepot">
				<button class="delete" v-on:click="errorDeleteEntrepot=false"></button>
				 Il y a des véhicules dans cet entrepot, vous ne pouvez pas le supprimer !<br/>
				 Merci de déplacer les véhicules dans d'autres entrepots
		</div>
		<div class="notification is-danger" v-show="errorDeleteStock">
				<button class="delete" v-on:click="errorDeleteStock=false"></button>
				 Il y a des véhicules dans ce lieu de stockage, vous ne pouvez pas le supprimer !<br/>
				 Merci de déplacer les véhicules vers un autre lieu de stockage
		</div>
    	<br/><br/> 
		 </section>
		<footer class="modal-card-foot">
		 
			   <div  style="width:100%">
				  <s-button  theme="is-danger is-small"  icon="trash" label=""   @onclick="deleteEntepot"></s-button>
				  <div style="float:right">
				  <s-button  theme="is-warning  is-small"  icon="ban" label="Annuler"   @onclick="$emit('back')">></s-button>
				  <s-button  theme="is-success  is-small" icon="save" label="Enregistrer"  @onclick="save"></s-button>
				  </div>
				  </div>
		   
		  
		</footer>
    	

	</div>
	
      </div>
</template>
<script>

import entrepot_api from "@/firebase/entrepot_api.js"

export default {
	name: "editEntrepot",
	props: ["agence","entrepot","refresh"],
	
	data: function() {
		return {
			modalEditStock: "modal",
			stock: entrepot_api.api.json_stock,
			indexStock: -1,
			infoEntrepot: false,
			errorEntrepot: {
				nom: false,
				stock: false,
				nbstock: false
			},
			dataCollectionArray: [],
			refreshDrag: false,
			errorDeleteEntrepot: false,
			errorDeleteStock: false
		}
	},
	watch: {
		entrepot : function(val) {
			this.dataCollectionArray = 	this.$orderJson(this.entrepot.stocks);
		}
	},
	methods: {
		 sort(myArray) {
				this.$updateRang(myArray, this.dataCollectionArray);
				this.refreshDrag = !this.refreshDrag;
		},
		deleteEntepot() {
			var nbArticles = 0;
			for (var key in this.entrepot.stocks) {
				nbArticles+=Object.keys(this.entrepot.stocks[key].articles).length;
			}
			if (nbArticles == 0)
				entrepot_api.api.delete(this.agence, this.entrepot, ()=>{
					this.$emit("back");
				});
			else
				this.errorDeleteEntrepot = true;
		},
		deleteStock(idStock) {
			
			if (Object.keys(this.entrepot.stocks[idStock].articles).length == 0) {
				delete this.entrepot.stocks[idStock];
				this.dataCollectionArray = 	this.$orderJson(this.entrepot.stocks);
				this.$emit("refresh");
			}
			else
				this.errorDeleteStock = true;
		},
		save() {
			this.errorEntrepot.nom = this.entrepot.nom == "";
			this.errorEntrepot.stock = false;
			for (var key in this.entrepot.stocks) {
				this.errorEntrepot.stock = this.entrepot.stocks[key].nom == "" || this.errorEntrepot.stock;
				this.errorEntrepot.stock = this.entrepot.stocks[key].capacite == "" || this.errorEntrepot.stock;
			}
			this.errorEntrepot.nbstock = Object.keys(this.entrepot.stocks).length == 0
			
			var error = this.errorEntrepot.nom || this.errorEntrepot.stock || this.errorEntrepot.nbstock;

			if (error == false) {
				entrepot_api.api.save (this.agence, this.entrepot, (entrepot)=>{
					this.errorEntrepot.nom = false;
						this.$emit("back");
					}
				); 
			}
		},
		addStock() {
			var newStock = JSON.parse(JSON.stringify(entrepot_api.api.json_stock));
			newStock.id=this.$uuid();				
			this.entrepot.stocks[newStock.id] = newStock;
			this.dataCollectionArray = 	this.$orderJson(this.entrepot.stocks);
			this.$emit("refresh");
		}
		
	},
	mounted: function() {
		
	}

}
</script>
<style scoped>
.itemList {
	list-style-type:none;
}
.listStock {
	overflow-y: auto;
	height: 250px;
}
.itemDraggable {
		border: thin solid rgb(187, 184, 184);
		margin-top: 5px;
		margin-right: 5px;
		padding: 5px;
	}
  .itemDraggable:hover {
		cursor: grab
	}
  
</style>