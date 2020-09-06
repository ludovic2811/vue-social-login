<template>
	<div class="contain">
		<span class="label">
    		Nom de l'entrepot :
    	</span>

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
    	<ol>
    		<li  v-for="(stock, index) in entrepot.stocks" class="itemList" >
    			<input type="text" class="input"  style="width:150px" v-model="stock.nom" placeholder="Nom du lieu de stockage"/>
    			&nbsp;&nbsp;<input type="number" class="input"  style="width:100px" v-model="stock.capacite" placeholder="Capacite" />
    			&nbsp;&nbsp;
    			<s-button  theme="is-danger" icon="trash" label="Supprimer"  @onclick="deleteStock(index)"></s-button>
    			<br/><br/>


    		</li>
    	</ol>
    	<div class="notification is-danger" v-show="errorEntrepot.stock">
				<button class="delete" v-on:click="errorEntrepot.stock=false"></button>
				 Le nom d'un lieu de stockage est obligatoire et la capacité aussi !
		</div>
		
		<footer class="footer">
		  <div class="content ">
		  	<s-button theme="is-warning" icon="list" label="Retourner à la liste"  @onclick="$emit('refresh')"></s-button>
		    &nbsp;&nbsp;
		    <s-button theme="is-success" icon="save" label="Enregistrer"  @onclick="save"></s-button>
			&nbsp;&nbsp;
			<s-button theme="is-danger" icon="trash" label="Supprimer"  @onclick="deleteEntepot" ></s-button>
		  </div>
		</footer>
    	<div :class="modalEditStock">
			<div class="modal-background"></div>
			<div class="modal-card">
				<header class="modal-card-head">
				  <p class="modal-card-title">Lieu de stockage</p>
				 
				</header>
				<section class="modal-card-body">
				  <!-- Content ... -->

				  <label class="label">
				  	Nom : 
				  </label>
				  <input type="text" class="text" v-model="stock.nom"/>
				  <label class="label">
				  	Capacité :
				  </label>
				  <input type="number" class="text" v-model="stock.capacite"/>
				  <input type="hidden" :value="indexStock"/>
				</section>
				<footer class="modal-card-foot">
				  <s-button  theme="is-sucess" icon="save" label="Enregistrer"  @onclick="saveStock"></s-button>
				  <s-button  theme="" icon="save" label="Cancel"  @onclick="modalEditStock='modal'"></s-button>
				
				</footer>
			</div>
		</div>

	</div>
</template>
<script>

import entrepot_api from "@/firebase/entrepot_api.js"

export default {
	name: "editEntrepot",
	props: ["entrepot"],
	
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
			entrepot_api.api.delete(this.$store, this.entrepot.id, ()=>{
				this.$emit("back");
			});
		},
		deleteStock(index) {
			this.entrepot.stocks.splice(index,1);
			this.save();
		},
		save() {
			
			this.errorEntrepot.nom = this.entrepot.nom == "";
			this.errorEntrepot.stock = false;
			this.entrepot.stocks.forEach(stock=>{
				this.errorEntrepot.stock = stock.nom == "" || this.errorEntrepot.stock;
				this.errorEntrepot.stock = stock.capacite == "" || this.errorEntrepot.stock;
			})
			var error = this.errorEntrepot.nom || this.errorEntrepot.stock;

			if (error == false) {
				this.entrepot.stocks.forEach((stock,index)=>{
					this.entrepot.stocks[index].capacite = parseFloat(stock.capacite);
				})
				entrepot_api.api.addOrUpdate (this.$store.getters.getDocAgence, this.entrepot, (entrepot)=>{
					
					if (typeof(entrepot) != "undefined")
						this.entrepot.id = entrepot.id;
					this.errorEntrepot.nom = false;
					
				}
				); 
			}
		},
		addStock() {
			this.stock = JSON.parse(JSON.stringify(entrepot_api.api.json_stock));
			this.stock.capacite = parseFloat(this.stock.capacite);
			this.modalEditStock='modal is-active';
			this.indexStock = -1;
		}
		,
		editStock(stock) {
			this.stock = stock;
			this.modalEditStock='modal is-active';
		},
		saveStock() {
			var new_json_stock = JSON.parse(JSON.stringify(this.stock));
			new_json_stock.capacite = parseFloat(new_json_stock.capacite);
			this.entrepot.stocks.push(new_json_stock);
			this.save();
			
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
</style>