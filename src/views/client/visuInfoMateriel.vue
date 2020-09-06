<template>
	<div >
		<div class="item">
	  		<div v-show="client.articles.length>1 && !visuArticle" class="articleList">
	  			<div  v-for="(article, index) in client.articles" class="itemArticleList">
						<i :class="getClassCategorie(article.idCategorie)"></i>
				 				&nbsp;&nbsp;
						<div style="width:200px;display:inline-block">
							<p class="subtitle is-6">{{article.numero}}</p>
						</div>
						<s-button label="" icon="eye" theme="is-primary is-small" @onclick="setVisuArticle(index)"/> 
					
				</div>
	  		</div>
	  		<div v-if="client.articles.length==1 || visuArticle">
	  			<div >
	  					<nav class="level is-mobile">
							<div class="level-left"> 
								<div class="level-item">
									<s-button v-show="client.articles.length!=1" @onclick="visuArticle=false" label="" icon="list" theme="is-primary is-small">
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
									@save="save(client.articles[indexArticle])" @cancel="openModalEtat=false"
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
									@save="save(client.articles[indexArticle])" @cancel="openModalEntrepot=false">
								</s-select-entrepot>
	  				<div class="dates">
	  					
	  					<div>Parti le :</div>
	  					<input type="date" v-model="client.articles[indexArticle].partirle" class="input is-danger is-normal is-rounded"  style="width:160px" @change="save(client.articles[indexArticle])"/><br/>
	  					<div>Revient le :</div>
	  					<input type="date" v-model="client.articles[indexArticle].rentrele" style="width:160px" class="input is-normal is-primary  is-rounded"  @change="save(client.articles[indexArticle])"/>	
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
			setVisuArticle(index) {
				this.visuArticle = true;
				this.indexArticle = index;
			},
			getClassCategorie(idCategorie) {
				var index = this.$store.getters.getCategories.findIndex(elt=>elt.id == idCategorie);
				if (index!=-1) {
					return this.$store.getters.getCategories[index].icon;
				}
				return "";
			},
			getClassEtat(indexEtat) {
				var index = this.$store.getters.getEtats.findIndex(elt=>elt.id == indexEtat);
				if (index!=-1) {
					return this.$store.getters.getEtats[index].icon;
				}
				return "";
			},
			getLabelEntrepot(idEntrepot, indexType) {
				var index = this.$store.getters.getEntrepots.findIndex(elt=>elt.id == idEntrepot);
				if (index!=-1) {
					var entrepot = this.$store.getters.getEntrepots[index].nom;
					var type = this.$store.getters.getEntrepots[indexType].stocks[indexType].nom;
					return entrepot + " / " + type;

				}
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