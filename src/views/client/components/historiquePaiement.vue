<template>
	<div :class="classModal">
		<div class="modal-background"></div>
  		<div class="modal-card" style="width:90%">
	    	<header class="modal-card-head">
		      <p class="modal-card-title" v-if='article'>Paiements pour l'article<br/>{{article.numero}}</p>	
		      <div style="float:rigth" >
			      	<s-button theme="" label="" icon="times-circle" @onclick="close"/>
		      </div>
			</header>
			<section class="modal-card-body">
				<div class="listHistorique" >
					<div v-for="paiement in arrayPaiements"  >
						<div class="itemYear">
							<s-button theme=" is-small" :icon="(showYear == paiement.year) ? 'caret-down' : 'caret-up'" label="" @onclick="showHisto(paiement.year)"/> 
							&nbsp; {{paiement.year}} : Reçu {{paiement.total}} €  sur 
							<span class="control has-icons-right"  style="width:100px">
								<input type="number" class="input is-primary is-rounded is-small" 
									style="width:80px" v-model="paiement.estimate_price" 
									@change="verifConfirm(paiement)"/>
								<span class="icon is-right">
									<i class="fas fa-euro-sign"></i>
								</span>
							</span>
								
							<div style="float:right">
								<s-button 
									:label="(paiement.confirm) ? '' : ''" 
									:icon="(paiement.confirm) ? 'check' : 'exclamation'"
									:theme="(paiement.confirm) ? ' is-success is-small' : ' is-warning is-small ' "
									@onclick="confirmPaiement(paiement)"
								></s-button>
							</div>
						</div>
						<div v-for="(echeance,index) in paiement.echeances" class="itemHistorique" v-show="showYear == paiement.year">
							
							<span>{{echeance.libelle}} : </span>&nbsp;
							<span>{{echeance.prix}} €</span>&nbsp;
							<br/>
							<span>
								{{$store.getters.getAgence.typePaiements[echeance.typePaiement].nom}} 
								reçu par {{echeance.user}}
							</span>
							
								<s-button theme="is-danger is-small" icon="trash" 
								@onclick="deleteEcheance(paiement.year, index)" label="">
								</s-button>
						</div>
						<br/>
					</div>
				</div>
			</section>
			<footer class="modal-card-foot">
				<div>
				<div class="ligneEcheance">
					<span class="libelleEcheance">Echeance pour l'année :</span>
					<div class="yearEcheance">
					<input type="number" class="input is-primary is-rounded" v-model="year" style="width:80px"/>
					</div>
					<div class="notification is-danger" v-show="error.year">
						<button class="delete" v-on:click="error.year=false"></button>
						Mauvaise année !!
					</div>
					<div class="montantEcheance">
						<input style="width:300px" type="text" class="input is-primary is-rounded" 
						placeholder="Mettre l'échéance" v-model="echeanceData.libelle"/>

					</div>
					<div class="notification is-danger" v-show="error.echeance">
						<button class="delete" v-on:click="error.echeance=false"></button>
						Il faut renseigner une échéance ... comme en une fois ou encore 1/2 ...
						N'hésitez à remettre le prix total 
					</div>
				</div>
				<div class="ligneMontant">
					<span class="control has-icons-right"  style="width:100px">
						<input type="number" class="input is-primary is-rounded" style="width:100px" v-model="echeanceData.prix"/>
						<span class="icon is-right">
							<i class="fas fa-euro-sign"></i>
						</span>
					</span>
					<div class="notification is-danger" v-show="error.prix">
									<button class="delete" v-on:click="error.prix=false"></button>
									Vous devez renseigner un montant !
							</div>
						&nbsp;
						en 
						<div class="select is-primary is-rounded ">
							<select v-model="echeanceData.typePaiement" >
								<option disabled="">Mode paiement</option>				
								<option v-for="typePaiement in $store.getters.getAgence.typePaiements" :value="typePaiement.id">
									{{typePaiement.nom}}
								</option>
							</select>
							<div class="notification is-danger" v-show="error.typePaiement">
									<button class="delete" v-on:click="error.typePaiement=false"></button>
									Vous devez renseigner un mode paiement !
							</div>
							
						</div>
						<div class="buttonAdd">
							<s-button label="Ajouter" theme="is-primary" icon="plus" @onclick="addEcheance"/>
						</div>
						</div>
				</div>
			</footer>
  		</div>
	</div>
</template>
<script >
	
	import paiement_api from '@/firebase/paiement_api'

	export default {
		props: ["open","client", "article","cancel"],
		data: function() {
			return {
				listPaiements: {},
				arrayPaiements :[],
				year: this.getYear(),
				echeanceData: paiement_api.api.json_echeance,
				showYear: -1,
				error: {
					echeance: false,
					year: false,
					typePaiement: false,
					prix: false
				},
				numero: null,
				classModal: "modal"
			}
		},
		watch: {
			open: {
                 handler(val) {                    
                  	if (val) {
						this.echeanceData.prix = this.article.prix;
						this.classModal = "modal is-active";
						this.init();
					}
					else {
						this.classModal = "modal";
					}
                 },
                 deep: true
            }			
		},
		methods: {
			close() {
				this.classModal='modal';
				this.$emit("close");
			},
			verifConfirm(paiement) {
				paiement.confirm = (paiement.total == paiement.estimate_price)
				this.updateConfirmDb(paiement);
			},
			updateConfirmDb(paiementItem) {
				paiement_api.api.set(this.$store, this.client, this.article, this.listPaiements, ()=>{
					paiement_api.api.confirmPaiementToArticle (this.$store, this.client, this.article,
						 paiementItem, (article)=> {
							this.article.paiements = article.paiements
					});
				});
			},
			
			confirmPaiement(paiement) {
				paiement.confirm = !paiement.confirm;
				this.updateConfirmDb(paiement);
				
			}
			,
			deleteEcheance (year, index) {
				this.listPaiements[year].total -= this.listPaiements[year].echeances[index].prix;
				this.listPaiements[year].echeances.splice(index,1);
				this.listPaiements[year].confirm = parseFloat(this.listPaiements[year].estimate_price)
								 ==  parseFloat(this.listPaiements[year].total);
				paiement_api.api.set(this.$store, this.client, this.article, this.listPaiements, ()=>{
							this.updateConfirmDb(this.listPaiements[year]);
							this.init();
				})
				
			},
			showHisto(year) {
				if (this.showYear == year)
					this.showYear = -1;
				else
					this.showYear = year
			},
			getYear() {
				var now = new Date();
				return now.getFullYear();
			},
			checkPaiement() {
				this.error.echeance = false;
				this.error.year = false;
				this.error.prix  = (this.echeanceData.prix == "");
				this.error.echeance  = (this.echeanceData.libelle == "");
				this.error.typePaiement  = (this.echeanceData.typePaiement == null);
				this.error.year = isNaN(parseInt(this.year));
				
				if (!this.error.year) {
					var yearInt = parseInt(this.year);
					this.error.year = !(yearInt >= 2000 && yearInt <= 3000)
				}
				
				var error = this.error.echeance || this.error.year || this.error.typePaiement || this.error.prix;
				
				return !error;
			},
			addEcheance () {
				if (this.checkPaiement()) {
					var year = parseInt(this.year);
					this.echeanceData.user = this.$store.getters.getUser.displayName;

					if (typeof(this.listPaiements[year]) == "undefined") {
						this.listPaiements[year] = JSON.parse(JSON.stringify(paiement_api.api.json_paiement));
						this.listPaiements[year].estimate_price = this.article.prix;						
						this.listPaiements[year].year = year;
						this.listPaiements[year].echeances = [];			
					}
					this.listPaiements[year].total += parseFloat(this.echeanceData.prix);
					
					this.listPaiements[year].confirm = parseFloat(this.listPaiements[year].estimate_price)
								 ==  parseFloat(this.listPaiements[year].total);
					
					this.listPaiements[year].echeances.push(this.echeanceData);
					
					paiement_api.api.set(this.$store, this.client, this.article, this.listPaiements, ()=>{
							this.updateConfirmDb(this.listPaiements[year]);
							this.init();
						})
				}
			},
			init() {
				this.listPaiements = {};
				this.arrayPaiements = [];
				
				paiement_api.api.getAll(this.$store, this.client , this.article, docs=> {
					this.listPaiements = docs;
					for (var key in this.listPaiements) {
						this.arrayPaiements.push(this.listPaiements[key])
					}
					this.arrayPaiements = this.arrayPaiements.sort(function(a, b){
				    return b.year-a.year
				})
				})
			}
		},
		
		mounted() {
			if (this.article) {
				
				this.echeanceData.prix = this.article.prix;
				this.init();
			}
		}
	}

</script>
<style scoped>
	.itemYear {
		width: 100%;
		text-align: left;
		margin-right: 0px;	
		font-weight: bolder;
	}
	.itemHistorique {
		width: 100%;
		padding-left: 50px;
		text-align: left;
		padding-bottom: 5px;
	}
	.itemHistorique:nth-child(even) {
		background-color: #F6FFE5;
		
	}
	.itemHistorique:nth-child(odd) {
		background-color: #FFF6C9;    
	}
	.listHistorique {
		vertical-align: top;
		overflow-y: scroll;
		height: 250px;
		
		padding: 5px;
		border: thin solid silver;

	}
	.ligneEcheance {
		margin-bottom: 5px;
		padding-bottom: 5px;
		padding-top: 5px;	
	}
	.libelleEcheance  {
		font-weight: bold;
		vertical-align: middle;
		padding-right: 10px;
		padding-top: 5px;
		display: inline-block
	}
	.buttonAdd {
		float: right;
		margin-top: 5px;
	}
	.montantEcheance {
		padding-top: 5px;
		display:inline-block
	}
	.yearEcheance {
		padding-top: 5px;
		display:inline-block;
		margin-right: 5px;
	}
</style>