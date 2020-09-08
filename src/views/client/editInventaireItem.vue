<template>
	<div>
		<div class="modal-background"></div>
		<div class="modal-card">
			<header class="modal-card-head">
			  <p class="modal-card-title">Editer le article</p>
			</header>
			<section class="modal-card-body">
			<div>
				<div class="tile is-ancestor">
					<div class="tile">
						<div class="tile is-child box">
							<label class="label">NUMERO :</label>
							<input type="text"  class="input" id="numero" v-model="article.numero" />
							<input type="text"  class="input" v-model="article.id" />
						</div>
						<div class="notification is-danger" v-show="error.numero">
							<button class="delete" v-on:click="error.numero=false"></button>
							Le numéro est obligatoire, il permet d'identifier l'article !
						</div>
					</div>
					
				</div>
				<div class="tile is-ancestor">
					
					<div class="tile is-child box">
						<span class="label">Ajouter :</span>
						{{article.idCategorie}}
						<s-select :list="$store.getters.getAgence.categories" :fields="fieldsCategories" :valueSelected="article.idCategorie" @selected="setCategorie" labelNotSelected="Selectionner"/>
						<br/>
						<div class="notification is-danger" v-show="error.categorie">
							<button class="delete" v-on:click="error.categorie=false"></button>
							Il faut sélectionner une catégorie !
						</div>

						<label class="label">Type :</label>
						<select class='select' v-model="article.idType" v-on:change="setType" >
							<option value="" disabled="" >Sélectionner le type</option>
							<option v-for="type in types" :value="type.id">{{type.nom}}</option>			
								</select>
						<br/>
						<span class="label">Tarif à l'année :</span>
						<span class="control has-icons-right"  style="width:100px">
							<input type="number" class="input is-primary is-rounded" style="width:100px" v-model="article.prix"/>
							<span class="icon is-right">
							    <i class="fas fa-euro-sign"></i>
							  </span>
						</span>
						
						&nbsp;<br/><br/>
						<s-button-paiement :change="modalTypePaiement" :article="article" @onclick="modalTypePaiement = true"><br/><br/>
						</s-button-paiement>
						<span class="comment">Cliquez sur le bouton pour mettre à jour les paiements</span>
						
						
						
					</div>
					<div class="tile is-child box">
						<br/>
						<label class="label">Etat :</label>
						<s-select :list="$store.getters.getAgence.etats" :fields="fieldsEtat" :valueSelected="article.idEtat" @selected="setEtat" labelNotSelected="Selectionner"></s-select>
						<div class="notification is-danger" v-show="error.etat">
							<button class="delete" v-on:click="error.etat=false"></button>
							Il faut sélectionner une catégorie !
						</div>

						<label class="label">Est rangé dans l'entrepot :</label>
						
						<select class='select' v-model="article.idEntrepot" v-on:change="setEntrepot">
							<option value="" disabled="" selected="">Sélectionner l'entrepot</option>
							<option v-for="entrepot in $store.getters.getAgence.entrepots" :value="entrepot.id">
								{{entrepot.nom}} ({{entrepot.reste}})</option>
						</select><br/>
						<div class="notification is-danger" v-show="error.entrepot">
							<button class="delete" v-on:click="error.entrepot=false"></button>
							Il faut sélectionner une catégorie !
						</div><br/>
						<select class='select' v-if="stocks.length!=0" v-model="article.idStock" >
							<option value="" disabled="" >Sélectionner le lieu de stockage</option>
							<option v-for="stock in stocks" :value="stock.id">
								{{stock.nom}} ({{stock.reste}})</option>
						</select>
						<br/>
						<histoPaiement 
							:article="article" 
							:open="modalTypePaiement" 
							@save="modalTypePaiement=false"
							:cancel="0==1" 
							@cancel="modalTypePaiement=false"
							>
						</histoPaiement>
					</div>
				</div>
					<div class="tile is-ancestor">
						<div class="tile is-child box">
						<label class="label">Va partir le :</label>
						<input type="date" class="input" v-model="article.partirle"/>
						<label class="label">Va rentrer le :</label>
						<input type="date" class="input" v-model="article.rentrele" />
						</div>
					</div>
				</div>
				</section>	
				<footer class="modal-card-foot">
				  <s-button  theme="is-success" icon="save" label="Enregistrer"  @onclick="saveArticle"></s-button>
				  <s-button  theme="is-warning" icon="ban" label="Cancel"  @onclick="$emit('cancel')"></s-button>
				  <s-button  theme="is-danger" icon="trash" label="Supprimer"  @onclick="$emit('delete')"></s-button>
				</footer>
			</div>
	</div>	
</template>
<script>
	import histoPaiement from '@/views/client/historiquePaiement.vue'
	import article_api from '@/firebase/article_api'
	import SButtonPaiement from '@/views/client/SButtonPaiement.vue'	 
	export default {

		props: ["article"],
		components: {
			histoPaiement,
			SButtonPaiement
		},
		data: function() {
			return {
				
				fieldsCategories: ["nom","id","icon"],
				fieldsEtat: ["nom","id","icon"],				
				types: [],
				stocks: [],
				themeAPayer: "is-danger" ,
				labelAPayer: "",
				checkAPayer: false,
				modalTypePaiement: false,
				error: {
					numero: false,
					categorie: false,
					etat: false,
					entrepot: false
				}
			}
		},
		methods: {
			setAPaye() {
				var year  =this.getYear();
				var label = "N'a pas payé " + year;
				this.themeAPayer = "is-danger";
				this.checkAPayer = false;
				if (typeof(this.article.paiements) != "undefined") 
					if (typeof(this.article.paiements[year]) != "undefined") {
						label = "a payé "+year;
						this.themeAPayer = "is-success";
						this.checkAPayer = true;
					}
				this.labelAPayer = label;

			},
			getYear() {
				var now = new Date();
				return now.getFullYear();
			},
			setCategorie (item) {
				console.log(item);
				this.article.idCategorie = item.id;
				this.types = [];
				this.article.prix;
				if (typeof(this.$store.getters.getAgence.categories[item.id]) != "undefined")
					if (typeof(this.$store.getters.getAgence.categories[item.id]).types != "undefined") {
						
						this.types = this.$store.getters.getAgence.categories[item.id].types;
						
					}
			},
			setType() {		
				console.log(this.types);
				this.article.prix = this.types[this.article.idType].prix;
			},
			setEntrepot() {
				if (typeof(this.$store.getters.getAgence.entrepots[this.article.idEntrepot]) != "undefined")
					if (typeof(this.$store.getters.getAgence.entrepots[this.article.idEntrepot].stocks) != "undefined")
						this.stocks = this.$store.getters.getAgence.entrepots[this.article.idEntrepot].stocks;
			},
			setEtat(item) {				
				this.article.idEtat = item.id;
			},
			saveArticle() {
				this.error.numero = this.article.numero == ''
				this.error.categorie = this.article.idCategorie == 0
				this.error.etat = this.article.idEtat == 0
				this.error.entrepot = this.article.idEntrepot == 0
				var error = this.error.numero || this.error.categorie || this.error.etat || this.error.entrepot;

				if (!error)
					this.$emit("save", this.article);
			}
		},
		mounted() {
			if (typeof(this.$store.getters.getAgence.entrepots[this.article.idEntrepot]) != "undefined")
					if (typeof(this.$store.getters.getAgence.entrepots[this.article.idEntrepot].stocks) != "undefined")
						this.stocks = this.$store.getters.getAgence.entrepots[this.article.idEntrepot].stocks;
			if (typeof(this.$store.getters.getAgence.categories[this.article.idCategorie]) != "undefined")
					if (typeof(this.$store.getters.getAgence.categories[this.article.idCategorie]).types != "undefined") {
						this.types = this.$store.getters.getAgence.categories[this.article.idCategorie].types;
					}
		}
	}
</script>

<style scoped>
	.miniLabel {
		width: "100px";
		text-align: rigth;
	}
	.comment {
		font-style: italic;
		font-size: x-small;
	}
	#numero {
    	text-transform: uppercase
	}
</style>