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
						<s-select :list="$store.getters.getCategories" :fields="fieldsCategories" :valueSelected="article.idCategorie" @selected="setCategorie" labelNotSelected="Selectionner"/>
						<br/>
						<div class="notification is-danger" v-show="error.categorie">
							<button class="delete" v-on:click="error.categorie=false"></button>
							Il faut sélectionner une catégorie !
						</div>

						<label class="label">Type :</label>
						<select class='select' v-model="article.indexType" v-on:change="setType" >
							<option value="" disabled="" selected="">Sélectionner le type</option>
							<option v-for="(type, index) in types" :value="index">{{type.nom}}</option>			
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
						<s-select :list="$store.getters.getEtats" :fields="fieldsEtat" :valueSelected="article.indexEtat" @selected="setEtat" labelNotSelected="Selectionner"></s-select>
						<div class="notification is-danger" v-show="error.etat">
							<button class="delete" v-on:click="error.etat=false"></button>
							Il faut sélectionner une catégorie !
						</div>

						<label class="label">Est rangé dans l'entrepot :</label>
						
						<select class='select' v-model="article.idEntrepot" v-on:change="setEntrepot">
							<option value="" disabled="" selected="">Sélectionner l'entrepot</option>
							<option v-for="entrepot in $store.getters.getEntrepots" :value="entrepot.id">
								{{entrepot.nom}} ({{entrepot.reste}})</option>
						</select><br/>
						<div class="notification is-danger" v-show="error.entrepot">
							<button class="delete" v-on:click="error.entrepot=false"></button>
							Il faut sélectionner une catégorie !
						</div><br/>
						<select class='select' v-if="stocks.length!=0" v-model="article.indexStock" >
							<option value="" disabled="" selected="">Sélectionner le lieu de stockage</option>
							<option v-for="(stock,indexStock) in stocks" :value="indexStock">
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
				var indexCategorie = this.$store.getters.getCategories.findIndex(categorie=>categorie.id === item.id);
				this.article.idCategorie = this.$store.getters.getCategories[indexCategorie].id;
				this.types = this.$store.getters.getCategories[indexCategorie].types;
				this.article.prix = this.types[this.article.indexType].prix;
			},
			setType() {		
				this.article.prix = this.types[this.article.indexType].prix;
			},
			setEntrepot() {
				var indexEntrepot = this.$store.getters.getEntrepots.findIndex(entrepot=>entrepot.id === this.article.idEntrepot);
				this.stocks = this.$store.getters.getEntrepots[indexEntrepot].stocks;
			},
			setEtat(item) {				
				this.article.indexEtat = item.id;
			},
			saveArticle() {
				this.error.numero = this.article.numero == ''
				this.error.categorie = this.article.idCategorie == 0
				this.error.etat = this.article.indexEtat == 0
				this.error.entrepot = this.article.idEntrepot == 0
				var error = this.error.numero || this.error.categorie || this.error.etat || this.error.stock;
				console.log(JSON.parse(JSON.stringify(this.article)));
				if (!error)
					this.$emit("save");
			}
		},
		mounted() {
			var indexCategorie = this.$store.getters.getCategories.findIndex(categorie=>categorie.id === this.article.idCategorie);
			if (indexCategorie!=-1)
				this.types = this.$store.getters.getCategories[indexCategorie].types;

			var indexEntrepot = this.$store.getters.getEntrepots.findIndex(entrepot=>entrepot.id === this.article.idEntrepot);
			if (indexEntrepot!=-1)
				this.stocks = this.$store.getters.getEntrepots[indexEntrepot].stocks;

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