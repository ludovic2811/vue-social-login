<template>
	<div>
		<div class="modal-background" ></div>
		<div class="modal-card"  style="width:90%">
			<header class="modal-card-head">
			  <p class="modal-card-title">Saisir le véhicule {{article.numero}} {{article.complement}} </p>
			   		  <div style="float:rigth" >
				      	<s-button theme="" label="" icon="times-circle" @onclick="$emit('cancel')"/>
				      </div>
			</header>
			<section class="modal-card-body">
			<div>
				<div class="tile is-ancestor">
					<div class="tile">
						<div class="tile is-child box">
							<label class="label">NUMERO :</label>
							<input maxlength="10" type="text" style="width:120px" class="input is-rounded" id="numero" v-model="article.numero" placeholder="Plaque"/>
							&nbsp;
							<input maxlength="10" type="text" style="width:120px"  class="input is-rounded" id="numero" v-model="article.complement" placeholder="Complement"/>
							
						</div>
						<div class="notification is-danger" v-show="error.numero">
							<button class="delete" v-on:click="error.numero=false"></button>
							Le numéro est obligatoire, il permet d'identifier l'article !
						</div>
					</div>
					
				</div>
				<div class="tile is-ancestor">
					
					<div class="tile is-child box">
						<span class="label">Catégorie :</span>
						
						<s-select :list="$store.getters.getAgence.categories" :fields="fieldsCategories" :valueSelected="article.idCategorie" @selected="setCategorie" labelNotSelected="Selectionner"/>
						<br/>
						<div class="notification is-danger" v-show="error.categorie">
							<button class="delete" v-on:click="error.categorie=false"></button>
							Il faut sélectionner une catégorie !
						</div>

						<label class="label">Type :</label>
						<select class='select is-rounded' v-model="article.idType" v-on:change="setType" >
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
						
						&nbsp;
						<div style="padding-top:5px">
						<s-button-paiement 
							:change="openHistoPaiement" 
							:article="article" 
							v-show="article.numero!=''" 
							@onclick="openModalHistoPaiement()"><br/><br/>
						</s-button-paiement>
						</div>
						<span class="comment">Cliquez pour mettre à jour les paiements</span>
						
					</div>
					<div class="tile is-child box">
						
						<label class="label">Etat :</label>
						<s-select :list="$store.getters.getAgence.etats" :fields="fieldsEtat" :valueSelected="article.idEtat" @selected="setEtat" labelNotSelected="Selectionner"></s-select>
						<div class="notification is-danger" v-show="error.etat">
							<button class="delete" v-on:click="error.etat=false"></button>
							Il faut sélectionner une catégorie !
						</div>
						<br/><br/>
						<label class="label">Est rangé dans l'entrepot :</label>
						
						<select class='select is-rounded' v-model="article.idEntrepot" v-on:change="setEntrepot">
							<option value="" disabled="" selected="">Sélectionner l'entrepot</option>
							<option v-for="entrepot in $store.getters.getAgence.entrepots" :value="entrepot.id">
								{{entrepot.nom}} ({{entrepot.reste}})</option>
						</select><br/>
						<div class="notification is-danger" v-show="error.entrepot">
							<button class="delete" v-on:click="error.entrepot=false"></button>
							Il faut sélectionner une catégorie !
						</div><br/>
						<select class='select is-rounded' v-if="stocks.length!=0" v-model="article.idStock" >
							<option value="" disabled="" >Sélectionner le lieu de stockage</option>
							<option v-for="stock in stocks" :value="stock.id">
								{{stock.nom}} ({{stock.reste}})</option>
						</select>
						
						
					</div>
				</div>
					<div class="tile is-ancestor">
						<div class="tile is-child box">
							<div class="groupDate">
							<div class="dateItems">
								<div>
									<div class="labelDate">Part le </div>
									<span v-if="article.departLe!=''">{{$convertDateToString(article.departLe)}} </span>
									<span class="nonDef" v-if="article.departLe==''">non défini</span></div>
								<div>
									<div class="labelDate">Rentre le </div> 
									<span v-if="article.rentreLe!=''">{{$convertDateToString(article.rentreLe)}} </span>
									<span class="nonDef" v-if="article.rentreLe==''">non défini</span></div>
							</div>
							
							<div class="buttonInOut">
								<s-button theme="is-primary " label="" icon="calendar-alt" 
								@onclick="openModalInOut(client, article)"></s-button>
							</div>
							</div>
							
						</div>
					</div>
				</div>
				
				</section>	
				<footer class="modal-card-foot" >
				  <div style="width:100%">
				  <s-button  theme="is-danger is-small" icon="trash" label="Supprimer"  @onclick="$emit('delete')"></s-button>
				  <div style="float: right">
				  <s-button  theme="is-success  is-small" icon="save" label="Enregistrer"  @onclick="saveArticle"></s-button>
				  </div>
				  </div>
				</footer>  
			</div>
	</div>	
</template>
<script>
	import article_api 		from '@/firebase/article_api'

	
	import SButtonPaiement 	from '@/views/client/components/SButtonPaiement.vue'	 
	
	export default {

		props: ["article","client"],
		components: {
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
				openHistoPaiement: false,
				openInOut: false,
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
				
				this.article.idCategorie = item.id;
				this.types = [];
				this.article.prix;
				if (typeof(this.$store.getters.getAgence.categories[item.id]) != "undefined")
					if (typeof(this.$store.getters.getAgence.categories[item.id]).types != "undefined") {
						
						this.types = this.$store.getters.getAgence.categories[item.id].types;
						
					}
			},
			setType() {		
				
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
			openModalInOut() {
				var error = this.checkArticle();
				if (!error) {
					this.saveArticle();
					this.$emit("openInOut", this.article);
					this.openInOut = true;
				}
			},
			openModalHistoPaiement() {
				var error = this.checkArticle();
				if (!error) {
					this.saveArticle();
					this.$emit("openHisto", this.article);
					this.openHistoPaiement = true;
				}
			},
			checkArticle() {
				this.error.numero = this.article.numero == ''
				this.error.categorie = this.article.idCategorie == 0
				this.error.etat = this.article.idEtat == 0
				this.error.entrepot = this.article.idEntrepot == 0
				return this.error.numero || this.error.categorie || this.error.etat || this.error.entrepot;
			},
			saveArticle() {
				var error = this.checkArticle();
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
	.groupDate {
	
		vertical-align: top;
		height: 45px;
	}
	.dateItems {
		font-weight: bold;
		display: inline-block;
		
		padding-top: -5px;
	}
	.dateItems div {
		width: 180px;
		
	}
	.dateItems span.nonDef {
		font-style: italic;
		font-size:smaller;
		font-weight: normal;
	}
	.dateItems div.labelDate {
		width: 90px;
		display: inline-block;
		text-align: left;
	}
	.buttonInOut {
		display: inline-block;
		vertical-align: middle;
		height: 55px;
		
	}
</style>