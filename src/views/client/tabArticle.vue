<template>
	<div >
		<div class="item">
			<div v-show="!visuArticle && Object.keys(this.client.articles).length==0" class="notArticle">
				Aucun véhicule pour client
			</div>
	  		<div v-show="!visuArticle" class="articleList">
	  			<div  v-for="article in this.client.articles" class="itemArticleList">
						<i :class="getClassCategorie(article.idCategorie)"></i>
				 				&nbsp;&nbsp;
						<div style="width:190px;display:inline-block">
							<p class="subtitle is-6">{{article.numero}} {{article.complement}}</p>
						</div>
						<s-button label="" icon="eye" theme="is-primary is-small" @onclick="setVisuArticle(article.id)"/> 
					
				</div>
	  		</div>
	  		<div v-if="visuArticle">
	  			<div >
	  					<nav class="level is-mobile">
							<div class="level-left"> 
								<div class="level-item">
									
									<s-button v-show="Object.keys(this.client.articles).length!=1" @onclick="visuArticle=false" label="" icon="list" theme="is-primary is-small">
									</s-button>&nbsp;&nbsp;
									<p class="subtitle is-6">
										<i :class="getClassCategorie(articleVisu.idCategorie)"/>
	  									&nbsp;&nbsp;<b>{{articleVisu.numero}} {{articleVisu.complement}}</b>
									 </p>
								</div>
							</div>
							<div class="level-rigth">
								<s-button label="" :icon="getClassEtat(articleVisu.idEtat)" 
									:theme="isEtatOk() ? 'is-success' : 'is-warning'" @onclick="openModalEtat=true"
									:afterIcon="!isEtatOk() ? 'exclamation' : ''"/>
								
								
								<s-select-etat :open="openModalEtat" :article="articleVisu"
									@save="save(articleVisu)" @cancel="openModalEtat=false"
								>
								</s-select-etat>
							</div>
						</nav>
	  					<s-button-paiement 
							:article="articleVisu" 
						  	@onclick="openModalHistoPaiement(client, articleVisu)">
	  					</s-button-paiement>&nbsp;<br/>
						
					<br/>
	  				<s-button :label="getLabelEntrepot(articleVisu.idEntrepot, articleVisu.idStock)" icon="industry" theme="is-primary is-normal" @onclick="openModalEntrepot=true"/>
	  				<s-select-entrepot 
	  					:open="openModalEntrepot" :article="articleVisu"
						@save="save(articleVisu)" 
						@cancel="openModalEntrepot=false">
					</s-select-entrepot>
	  				<div class="dates">
						<div class="nextSortie" v-show="isNextPlanifOk()">Prochaine sortie :</div>
						<div class="lastSortie" v-show="!isNextPlanifOk()">Dernière sortie :
							<div class="infoNextSortie" v-show="!isNextPlanifOk()"> 
								Pas de sortie programmée
							</div>

						</div>
						<div :class="isNextPlanifOk() ? 'itemDate' : 'itemDateKO'">
							<div>Depart le : </div><div>
								{{$convertDateToString(articleVisu.departLe)}}</div><br/>
							<div>Rentre le :</div><div>
								{{$convertDateToString(articleVisu.rentreLe)}}</div>
						</div>
						
						<div class="buttonInOut"> 
	  						<s-button :theme="isNextPlanifOk() ? 'is-primary' : 'is-warning'" label="" icon="calendar-alt" 
						  	@onclick="openModalInOut(client, articleVisu)"></s-button>
						</div>
						
	  				</div>
					
	  			</div>
	  		
	  		</div>
	  		
	  	</div>
	  	
	  	<footer class="footer is-primary">
			<div class="content has-text-centered">
				<p>
				  <!-- Brand and toggle get grouped for better mobile display -->
					<button class="button is-normal is-primary is-rounded" v-on:click="edit()" v-if="modif">
						<i class="fa fa-edit"/>&nbsp;
						<span  >Modifier</span>
					</button>	
      			</p>
      		</div>
		</footer>
		
	 </div>
</template>
<script>
	import article_api 		from "@/firebase/article_api"
	import client_api 		from "@/firebase/client_api"
	import conso 			from "@/firebase/client_consolidation";
	import inout_api 			from "@/firebase/inout_api";

	import histoPaiement 	from '@/views/client/components/historiquePaiement.vue'
	import SButtonPaiement 	from '@/views/client/components/SButtonPaiement.vue'
	import SSelectEtat 		from '@/views/client/components/SSelectEtat.vue'
	import SSelectEntrepot 	from '@/views/client/components/SSelectEntrepot.vue'
	import InOut 			from '@/views/client/components/inOut.vue'
	
	export default {
			
		props: ["agence","client","modif"],
		components: {
			histoPaiement,
			SButtonPaiement,
			SSelectEtat,
			SSelectEntrepot,
			InOut
		},
		data: function() {
			return {
				materiel: {},
				visuArticle : false,
				openModalEtat: false,
				openModalEntrepot: false,
				indexArticleVisu: 0,
				idArticleVisu: null
			}
		},
		computed: {
			articleVisu: function() {
				if( this.indexArticleVisu == 0) {
					this.visuArticle = true;
					if (Object.keys(this.client.articles).length>0)
						return JSON.parse(JSON.stringify(this.client.articles[Object.keys(this.client.articles)[this.indexArticleVisu]]));
					else {
						this.visuArticle = false;
						return {}
					}
				}
				else
					return JSON.parse(JSON.stringify(this.client.articles[this.idArticleVisu]));
			}
		},
		methods: {
			isNextPlanifOk() {
				var date = new Date();
				if (this.articleVisu.rentreLe < date) {
					return false;
				}
				else	
					return true;
			},
			isEtatOk() {
				
				var etat  = this.$store.getters.getAgence.etats[this.articleVisu.idEtat];
				var date = new Date();
				if (etat.out) {
					if (date >= this.articleVisu.departLe && date<this.articleVisu.rentreLe)
						return true;
					else	
						return false;
				}
				else
					if (date < this.articleVisu.departLe || date>this.articleVisu.rentreLe)
						return true;
					else	
						return false;
			},
			openModalHistoPaiement (client) {
				this.$emit("openModalHistoPaiement",  this.client, this.articleVisu);
			},
			openModalInOut(client) {
				this.$emit("openModalInOut", client,  this.articleVisu);
			},
			save(articleModif, articleDelete) {
				article_api.api.save(this.$store, this.client, articleModif, articleDelete, ()=>{
					
					this.openModalEntrepot=false;
					this.openModalEtat=false;
				})
			},
			setVisuArticle(idArticleVisu) {
				this.idArticleVisu = idArticleVisu;
				this.indexArticleVisu = -1;
				this.visuArticle = true;			
			},
			getClassCategorie(idCategorie) {
				if (typeof(this.$store.getters.getAgence.categories[idCategorie]) != "undefined")
					return this.$store.getters.getAgence.categories[idCategorie].icon;
				else
					return "";
			},
			getClassEtat(idEtat) {
				if (typeof(this.$store.getters.getAgence.etats[idEtat]) != "undefined")
					return this.$store.getters.getAgence.etats[idEtat].icon;
				else
					return "";
			},
			getLabelEntrepot(idEntrepot, idStock) {
				if (typeof(this.$store.getters.getAgence.entrepots[idEntrepot]) != "undefined") {
					
					if (typeof(this.$store.getters.getAgence.entrepots[idEntrepot].stocks[idStock]) != "undefined") {
						var nom = this.$store.getters.getAgence.entrepots[idEntrepot].nom
						return nom + " " + this.$store.getters.getAgence.entrepots[idEntrepot].stocks[idStock].nom;
					}
					else
						return "";	
				}
				else
					return "";

				
			},
			edit() {
				this.visuArticle = false;
				
				this.$emit('edit')
			},
			init() {
				
				if (Object.keys(this.client.articles).length == 1)
					this.visuArticle = true;	
				
			}
		},
		mounted() {
			this.init();
			var date = new Date();
			
			if (this.articleVisu.rentreLe < date) {
				inout_api.api.getAll(this.$store, this.client, this.articleVisu, inouts=>{
                    inout_api.api.updateArticle(this.$store, this.client, this.articleVisu, inouts,
						inouttemp=>{
						});
                })
			}
		}
	}
</script>
<style scoped>
	.lastSortie {
		font-weight: bold;
		text-decoration: underline;
		font-size: 13px;
		margin-bottom: 3px;
		color: coral;
	}
	.nextSortie {
		font-weight: bold;
		text-decoration: underline;
		font-size: 13px;
		margin-bottom: 3px;
	}
	.footer {
		padding-top: 5px;
		padding-bottom: 5px;
		background-color: white;
	}
	.item {
		background-color: #F2F3F4;
		padding: 10px;
		height: 250px;
		text-align: left;
		border-radius: 10px;
	}
	.dates {
		padding-top: 20px;
		height: 90px;
	}
	.infoNextSortie {
		width: 100%;
		float: left;
		display: block;
		color: coral;
		font-size: 10px;
		font-style: italic;
	}
	.itemDate {
		float: left;
		display: inline-block;		
		font-weight: bold;
	}
	.itemDateKO {
		float: left;
		display: inline-block;	
		font-weight: bold;	
		color: coral;
	}
	.buttonInOut {
		float: right;
		display: inline-block;	
	}
	.itemDate div {
		margin-bottom: 8px;
		width: 100px;
		display: inline-block;	
	}
	.itemDateKO div {
		margin-bottom: 5px;
		width: 100px;
		display: inline-block;	
	}
	.itemArticleList {
		padding-bottom: 10px;
	}
	.articleList {
		height: 220px;
		 overflow-y: auto;
	}
</style>