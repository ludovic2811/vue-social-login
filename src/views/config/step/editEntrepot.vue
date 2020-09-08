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

    	<s-button icon="plus" theme="is-primary" label="Ajouter un lieu de stockage"  @onclick="addStock"></s-button>&nbsp;
    	<s-button icon="info" theme="is-primary" label=""  @onclick="infoEntrepot=true"></s-button>
    	<div class="notification is-warning" v-show="infoEntrepot">
			<button class="delete" v-on:click="infoEntrepot=false"></button>
			Un lieu de stockage est l'emplacement où vous allez sotcker les articles de vos clients.
			 <br/> 
			 Vous devez définir une capacité de stockage
		</div>
		<br/><br/>
    	<div class="listStock">
    		<div  v-for="stock in entrepot.stocks" class="itemList" >
    			<input type="text" class="input"  style="width:150px" v-model="stock.nom" placeholder="Nom du lieu de stockage"/>
    			&nbsp;&nbsp;<input type="number" class="input is-rounded"  style="width:100px" v-model="stock.capacite" placeholder="Capacite" />
    			&nbsp;&nbsp;
    			<s-button  theme="is-danger" icon="trash" label=""  @onclick="deleteStock(stock.id)"></s-button>
    			<br/><br/>


    		</div>
    	</div>
    	<div class="notification is-danger" v-show="errorEntrepot.stock">
				<button class="delete" v-on:click="errorEntrepot.stock=false"></button>
				 Le nom d'un lieu de stockage est obligatoire et la capacité aussi !
		</div>
		 </section>
		<footer class="modal-card-foot">
		  <div class="content ">
		  	<s-button theme="is-warning" icon="list" label="Retourner à la liste"  @onclick="$emit('back')"></s-button>
		    &nbsp;&nbsp;
		    <s-button theme="is-success" icon="save" label="Enregistrer"  @onclick="save"></s-button>
			&nbsp;&nbsp;
			<s-button theme="is-danger" icon="trash" label="Supprimer"  @onclick="deleteEntepot" ></s-button>
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
				stock: false
			}
		}
	},
	methods: {
		deleteEntepot() {
			entrepot_api.api.delete(this.agence, this.entrepot, ()=>{
				this.$emit("back");
			});
		},
		deleteStock(idStock) {
			delete this.entrepot.stocks[idStock];
			this.$emit("refresh");
		},
		save() {
			
			this.errorEntrepot.nom = this.entrepot.nom == "";
			this.errorEntrepot.stock = false;
			for (var key in this.entrepot.stocks) {
				this.errorEntrepot.stock = this.entrepot.stocks[key].nom == "" || this.errorEntrepot.stock;
				this.errorEntrepot.stock = this.entrepot.stocks[key].capacite == "" || this.errorEntrepot.stock;
			}
			var error = this.errorEntrepot.nom || this.errorEntrepot.stock;

			if (error == false) {
				
				for (var key in this.entrepot.stocks) {
					this.entrepot.stocks[key].capacite = parseFloat(this.entrepot.stocks[key].capacite);
				}
				entrepot_api.api.save (this.agence, this.entrepot, (entrepot)=>{
					this.errorEntrepot.nom = false;
					}
				); 
			}
		},
		addStock() {
			var newStock = JSON.parse(JSON.stringify(entrepot_api.api.json_stock));
			newStock.id=this.$uuid();				
			this.entrepot.stocks[newStock.id] = newStock;
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
</style>