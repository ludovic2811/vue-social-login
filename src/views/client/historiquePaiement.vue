<template>
	<s-modal  :open="open" :title="'Liste des paiements pour '+numero" save="true" :cancel="cancel" @save="$emit('save')" @cancel="$emit('cancel')">
		<div >
			<div class="listHistorique">
				<div v-for="(paiement, indexPaiement) in listPaiements" >
					<div class="itemYear">
						<s-button theme=" is-small" :icon="(showIndex == indexPaiement) ? 'caret-down' : 'caret-up'" label="" @onclick="showHisto(indexPaiement)"/> 
					 &nbsp; {{paiement.year}} : Reçu {{paiement.total}} €  sur 
					 <span class="control has-icons-right"  style="width:100px">
						<input type="number" class="input is-primary is-rounded is-small" style="width:80px" v-model="paiement.prix" @change="verifConfirm(paiement)"/>
						<span class="icon is-right">
						    <i class="fas fa-euro-sign"></i>
						  </span>
					</span>
					 	
					<div style="float:right">
						<s-button 
							:label="(paiement.confirm) ? 'Totalité réglée' : 'Non réglée'" 
							:icon="(paiement.confirm) ? 'check' : 'exclamation'"
							:theme="(paiement.confirm) ? ' is-success is-small' : ' is-warning is-small ' "
							@onclick="confirmPaiement(paiement)"
						></s-button>
					</div>
					</div>
					<div v-for="(histo,index) in paiement.histo" class="itemHistorique" v-show="showIndex == indexPaiement">
						
						<span>{{histo.echeance}} : </span>&nbsp;
						<span>{{histo.prix}} €</span>&nbsp;
						<br/>
						<span>
							{{$store.getters.getAgence.typePaiements[histo.typePaiement].libelle}} reçu par {{histo.user}}
						</span>
						
							<s-button theme="is-danger is-small" icon="trash" @onclick="deleteHistorique(paiement, index)" label="">
							</s-button>
						
					</div>
					<br/>
				</div>
			</div>
			<br/><hr/>
			<label class="label">
				Le client a payé pour l'année :&nbsp;&nbsp;<input type="number" class="input is-primary is-rounded" v-model="year" style="width:100px"/>
				<div class="notification is-danger" v-show="error.year">
					<button class="delete" v-on:click="error.year=false"></button>
					Mauvaise année !!
				</div>
			</label>
			<input style="width:200px" type="text" class="input is-primary is-rounded" placeholder="Mettre l'échéance" v-model="paiementData.echeance"/>
			<div class="notification is-danger" v-show="error.echeance">
					<button class="delete" v-on:click="error.echeance=false"></button>
					Il faut renseigner une échéance ... comme en une fois ou encore 1/2 ...
					N'hésitez à remettre le prix total 
				</div>
			&nbsp;
			<span class="control has-icons-right"  style="width:100px">
				<input type="number" class="input is-primary is-rounded" style="width:100px" v-model="paiementData.prix"/>
				<span class="icon is-right">
				    <i class="fas fa-euro-sign"></i>
				  </span>
			</span>
			&nbsp;
			en <div class="select is-primary is-rounded ">
			<select v-model="paiementData.typePaiement" >
				<option disabled="">Mode paiement</option>				
				<option v-for="(typePaiement,index) in $store.getters.getAgence.typePaiements" :value="index">
					{{typePaiement.libelle}}
				</option>
			</select>
			
		</div>&nbsp;&nbsp;<br/><br/>
			<s-button label="Ajouter" theme="is-primary" icon="plus" @onclick="addPaiement"/>
		</div>

	</s-modal>
</template>
<script >
	import SModal from '@/components/SModal.vue'	
	export default {
		props: ["open","article","cancel"],
		components: {
			SModal
		},
		data: function() {
			return {
				listPaiements: [],
				year: this.getYear(),
				paiementData: {  
					typePaiement: 0,
					user: this.$store.getters.getUser.displayName,
					prix : null,
					echeance: ""
				},
				showIndex: -1,
				error: {
					echeance: false,
					year: false
				},
				numero: null
			}
		},
		watch: {
			open: function(val) {
				this.paiementData.prix = this.article.prix;
				this.init();
			}
		},
		methods: {
			verifConfirm(paiement) {
				paiement.confirm = paiement.total == paiement.prix;
				this.article.paiements[paiement.year].confirm = paiement.confirm;
				this.article.paiements[paiement.year].prix = paiement.prix;
			},
			confirmPaiement(paiement) {
				paiement.confirm = !paiement.confirm;
				this.article.paiements[paiement.year].confirm = paiement.confirm;
			},
			deleteHistorique(paiement, index) {
				this.article.paiements[paiement.year].total -= paiement.histo[index].prix;
				paiement.histo.splice(index,1);
				this.article.paiements[paiement.year].histos.splice(index, 1);
				if (paiement.histo.length == 0) {
					delete this.article.paiements[paiement.year];
				}
				this.init();
			},
			showHisto(indexPaiement) {
				if (this.showIndex == indexPaiement)
					this.showIndex = -1;
				else
					this.showIndex = indexPaiement
			},
			getYear() {
				var now = new Date();
				return now.getFullYear();
			},
			checkPaiement() {
				this.error.echeance = false;
				this.error.year = false;

				this.error.echeance  = (this.paiementData.echeance == "");
				
				this.error.year = isNaN(parseInt(this.year));
				
				if (!this.error.year) {
					var yearInt = parseInt(this.year);
					this.error.year = !(yearInt >= 2000 && yearInt <= 3000)
				}
				

				var error = this.error.echeance || this.error.libelle || this.error.year;
				
				return !error;
			},
			addPaiement() {
				if (this.checkPaiement()) {
					var histos = [];
					var total = 0;
					if (typeof(this.article.paiements) == "undefined") {
						this.article["paiements"] = {};
					}
					
					if (typeof(this.article.paiements[this.year])=="undefined") {
						this.article.paiements[this.year] = {} ;
						this.article.paiements[this.year].confirm = false;
						this.article.paiements[this.year].prix = this.article.prix;
						total = 0;
					}
					else {
						total  = parseFloat(this.article.paiements[this.year].total);
					}
					total += parseFloat(this.paiementData.prix);
					
					this.article.paiements[this.year].confirm = parseFloat(this.article.paiements[this.year].prix) == total;
					
					this.article.paiements[this.year].total = total;
					
					
					if (typeof(this.article.paiements[this.year].histos)=="undefined")
						this.article.paiements[this.year].histos = [];

					var paiementData = JSON.parse(JSON.stringify(this.paiementData))
					this.article.paiements[this.year].histos.push(paiementData);
					this.init();
				}
			},
			init() {
				this.listPaiements = [];
				
			
				
				if (this.article != null) {
					this.numero = this.article.numero;
//					this.paiementData.prix = this.article.prix;
					if (typeof(this.article.paiements) != "undefined") {
						Object.keys(this.article.paiements).forEach(year=> 
						 {

						 	var paiement  = {};
						 	paiement['year'] = year;
						 	paiement['total'] = parseFloat(this.article.paiements[year].total);
						 	paiement['prix'] = parseFloat(this.article.paiements[year].prix);
						 	paiement['confirm'] = this.article.paiements[year].confirm;
						 	var histos = this.article.paiements[year].histos;
						 	paiement['histo'] = histos;
						 	var paiementData = JSON.parse(JSON.stringify(paiement))
							this.listPaiements.push(paiementData)
							
						});
					}
				}
			}
		},
		
		mounted() {
			
			this.init();

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
    height: 180px;
    
    padding: 5px;
    border: thin solid silver;

}
</style>