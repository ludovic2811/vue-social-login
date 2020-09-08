<template>
	<div >
		<div class="item">
	  		<div v-show="Object.keys(this.client.articles).length >1 && !visuArticle" class="articleList">
	  			<div  v-for="article in client.articles" class="itemArticleList">
						<i :class="getClassCategorie(article.idCategorie)"></i>
				 				&nbsp;&nbsp;
						<div style="width:200px;display:inline-block">
							<p class="subtitle is-6">{{article.numero}}</p>
						</div>
						<s-button label="" icon="eye" theme="is-primary is-small" @onclick="setVisuArticle(article.id)"/> 
					
				</div>
	  		</div>
	  		<div v-if="Object.keys(this.client.articles).length==1 || visuArticle">
	  			<div >
	  					<nav class="level is-mobile">
							<div class="level-left"> 
								<div class="level-item">
									<s-button v-show="Object.keys(this.client.articles).length!=1" @onclick="visuArticle=false" label="" icon="list" theme="is-primary is-small">
									</s-button>&nbsp;&nbsp;
									<p class="subtitle is-6">
										<i :class="getClassCategorie(client.articles[indexArticle].idCategorie)"/>
	  									&nbsp;&nbsp;<b>{{client.articles[indexArticle].numero}}</b>
									 </p>
								</div>
							</div>
							<div class="level-rigth">
								<s-button label="" :icon="getClassEtat(client.articles[indexArticle].indexEtat)" theme="is-primary " @onclick="openModalEtat=true"/>
								<s-select-etat :open="openModalEtat" :article="client.articles[indexArticle]"
									@save="save(client.articles[indexArticle], "etat")" @cancel="openModalEtat=false"
								>
								</s-select-etat>
							</div>
						</nav>
	  					<s-button-paiement :change="modalTypePaiement" :article="client.articles[indexArticle]" @onclick="modalTypePaiement = true">
	  					</s-button-paiement>&nbsp;
						<histoPaiement 
						:article="client.articles[indexArticle]" 
						:open="modalTypePaiement" 
						@save="save(client.articles[indexArticle])"
						:cancel="0==1" 
						@cancel="modalTypePaiement=false"
						>
						</histoPaiement>
					<br/>
	  				<s-button :label="getLabelEntrepot(client.articles[indexArticle].idEntrepot, client.articles[indexArticle].indexType)" icon="industry" theme="is-primary is-normal" @onclick="openModalEntrepot=true"/>
	  				<s-select-entrepot :open="openModalEntrepot" :article="client.articles[indexArticle]"
									@save="save(client.articles[indexArticle], "entrepot")" @cancel="openModalEntrepot=false">
								</s-select-entrepot>
	  				<div class="dates">
	  					
	  					<div>Parti le : {{client.articles[indexArticle].partirle}}</div>
	  					<div>Revient le : {{client.articles[indexArticle].rentrele}}</div>
	  					<s-button theme="is-primary" label="" icon="calendar-alt" @onclick=""/> 
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
	export default {
			
		props: ["client","modif"],
		components: {
			histoPaiement,
			SButtonPaiement,
			SSelectEtat,
			SSelectEntrepot
		},
		data: function() {
			return {
				materiel: {},
				modalTypePaiement: false,
				indexArticle : 0,
				visuArticle : false,
				openModalEtat: false,
				openModalEntrepot: false
			}
		},
		methods: {
			save(article) {
				article_api.api.save(this.$store, this.client.id, article, ()=> {
					client_api.api.update(this.$store.getters.getDocAgence, this.client, ()=> {
						this.openModalEntrepot=false;
						this.modalTypePaiement=false;
						this.openModalEtat=false;
					})
				})
			},
			setVisuArticle(idArticle) {
				this.visuArticle = true;
				this.indexArticle = index;
			},
			getClassCategorie(idCategorie) {
				if (typeof(this.agence.categories[idCategorie]) != "undefined")
					return this.agence.categories[idCategorie].icon;
				else
					return "";
			},
			getClassEtat(idEtat) {
				if (typeof(this.agence.etats[idEtat]) != "undefined")
					return this.agence.etats[idEtat].icon;
				else
					return "";
			},
			getLabelEntrepot(idEntrepot, idType) {
				if (typeof(this.agence.entrepots[idCategorie]) != "undefined") {
					if (typeof(this.agence.entrepots[idCategorie].types[idType]) != "undefined") {
						var nom = this.agence.entrepots[idCategorie].nom
						return nom + " " + this.agence.entrepots[idCategorie].types[idType.icon].nom;
					}
					else
						return "";	
				}
				else
					return "";

				
			},
			edit() {
				this.visuArticle = false;
				this.indexArticle = 0;
				this.$emit('edit')
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
		padding-top: 15px;
	}
	.dates div {
		width: 100px;
		display: inline-block;		
		font-weight: bold;
	}
	.itemArticleList {
		padding-bottom: 10px;
	}
	.articleList {
		height: 220px;
		 overflow-y: auto;
	}
</style>