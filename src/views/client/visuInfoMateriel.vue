<template>
	<div >
		<div class="item">
	  		<div v-show="!visuArticle" class="articleList">
	  			<div  v-for="article in client.articles" class="itemArticleList">
						<i :class="getClassCategorie(article.idCategorie)"></i>
				 				&nbsp;&nbsp;
						<div style="width:200px;display:inline-block">
							<p class="subtitle is-6">{{article.numero}}</p>
						</div>
						<s-button label="" icon="eye" theme="is-primary is-small" @onclick="setVisuArticle(article)"/> 
					
				</div>
	  		</div>
	  		<div v-if=" visuArticle">
	  			<div >
	  					<nav class="level is-mobile">
							<div class="level-left"> 
								<div class="level-item">
									
									<s-button v-show="Object.keys(this.client.articles).length!=1" @onclick="visuArticle=false" label="" icon="list" theme="is-primary is-small">
									</s-button>&nbsp;&nbsp;
									<p class="subtitle is-6">
										<i :class="getClassCategorie(article.idCategorie)"/>
	  									&nbsp;&nbsp;<b>{{article.numero}}</b>
									 </p>
								</div>
							</div>
							<div class="level-rigth">
								<s-button label="" :icon="getClassEtat(article.idEtat)" theme="is-primary " @onclick="openModalEtat=true"/>
								<s-select-etat :open="openModalEtat" :article="article"
									@save="save(article, 'etat')" @cancel="openModalEtat=false"
								>
								</s-select-etat>
							</div>
						</nav>
	  					<s-button-paiement 
						  	
							:article="article" 
						  	@onclick="modalTypePaiement = true">
	  					</s-button-paiement>&nbsp;<br/>
						<histoPaiement 
							:article="article" 
							:client="client"
							:open="modalTypePaiement" 
							@save=""
							:cancel="0==1" 
							@close="modalTypePaiement=false"
							@cancel=""
						>
						</histoPaiement>
					<br/>
	  				<s-button :label="getLabelEntrepot(article.idEntrepot, article.idStock)" icon="industry" theme="is-primary is-normal" @onclick="openModalEntrepot=true"/>
	  				<s-select-entrepot 
	  					:open="openModalEntrepot" :article="article"
						@save="save(article, 'entrepot')" 
						@cancel="openModalEntrepot=false">
					</s-select-entrepot>
	  				<div class="dates">
						<div class="itemDate">
							<div>Parti le : </div><div>{{article.departLe}}</div><br/>
							<div>Rentre le :</div><div>{{article.rentreLe}}</div>
						</div>
						<div class="buttonInOut"> 
	  						<s-button theme="is-primary" label="" icon="calendar-alt" 
						  	@onclick="openModalInOut(client, article)"></s-button>
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
	import histoPaiement from '@/views/client/historiquePaiement.vue'
	import SButtonPaiement from '@/views/client/SButtonPaiement.vue'
	import SSelectEtat from '@/views/client/SSelectEtat.vue'
	import SSelectEntrepot from '@/views/client/SSelectEntrepot.vue'
	import article_api from "@/firebase/article_api"
	import client_api from "@/firebase/client_api"
	import conso from "@/firebase/client_consolidation"; 
	import InOut from '@/views/client/inOut.vue'
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
				modalTypePaiement: false,				
				visuArticle : false,
				openModalEtat: false,
				openModalEntrepot: false,
				openInOut: false,
				article: null
			}
		},
		methods: {
			
			openModalInOut(client, article) {
				this.article = article;
				this.openInOut = true;
				this.$emit("openModalInOut", client, article);
			},
			save(articleModif, type) {
				this.openModalEntrepot=false;
				this.modalTypePaiement=false;
				this.openModalEtat=false;
				conso.api.calculEspaceEntrepot (this.$store.getters.getAgence, 
							articleModif, this.client.articles[articleModif.numero], ()=>{
					this.client.articles[articleModif.numero] = articleModif;
				
					article_api.api.save(this.$store, this.client,()=>{
					
					});
				});
			},
			setVisuArticle(article) {
				this.visuArticle = true;
				this.article = JSON.parse(JSON.stringify(article));				
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
			}
		},
		mounted() {
			
			if (Object.keys(this.client.articles).length==1) {
				for (var key in this.client.articles) {
					this.article = JSON.parse(JSON.stringify(this.client.articles[key]));
					this.visuArticle = true;					
					break;
				}
			}

		}
	}
</script>
<style scoped>
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
	}
	.itemDate {
		float: left;
		display: inline-block;		
		font-weight: bold;
	}
	.buttonInOut {
		float: right;
		display: inline-block;	
	}
	.itemDate div {
		margin-bottom: 10px;
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