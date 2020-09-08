<template>
	<div class="container">
		
		<div class="field">		 
		    <input class="input is-rounded" type="text" placeholder="Nom du client" v-model="client.nom">		 		  
		</div>
		<div class="field">		 
		    <input class="input is-rounded" type="text" placeholder="Prénom du client" v-model="client.prenom">
		</div>
		<div class="tabs is-large is-boxed is-toggle-rounded is-fullwidth">
	 	<ul>
	    	<li :class="classTabInfoClient" v-on:click="tabInfoClient">
	    		<a >
	    			<span class="icon is-small">
	    				<i class="fa fa-address-card"/>&nbsp;&nbsp;
	    				<span class="subtitle is-6">Info Client</span>&nbsp;&nbsp;
	    			</span>
	    		</a>
	    	</li>
	    	<li :class="classTabMateriel"  v-on:click="tabInfoMateriel">
	    		<a>
	    			<span class="icon is-small">
	    				<i class="fa fa-wallet"/>&nbsp;&nbsp;
	    				<span class="subtitle is-6">Articles</span>&nbsp;&nbsp;
	    			</span>
	    		</a>
	    	</li>
	  	</ul>
	</div>
	<div v-show="classTabInfoClient=='is-active'" class="tab">
		<div class="field">		 
		    <input class="input is-rounded" type="text" placeholder="Téléphone 1" v-model="client.tel1">		 		  	
		</div>
		<div class="field">		 
		    <input class="input is-rounded" type="text" placeholder="Téléphone 2" v-model="client.tel2">		 		  	
		</div>
		<div class="field">		 
		    <input class="input is-rounded" type="text" placeholder="Téléphone 3" v-model="client.tel3">		 		  	
		</div>
		<div class="field">		 
		    <input class="input is-rounded" type="text" placeholder="Mail" v-model="client.mail">		 		  	
		</div>
		<div class="field">		 
		    <textarea class="textarea is-primary" type="text" placeholder="Adresse postale" v-model="client.adresse"></textarea>		
		</div>
	</div>
	<div v-if="classTabMateriel=='is-active'"  class="tab">
		<button class="button is-primary" v-on:click="openAddMartiel">
			<i class="fas fa-plus"/>&nbsp;&nbsp;<span>Ajouter un article</span>
		</button>
		<br/>
		<br/>
		<ul>
			<li v-for="article in client.articles">
				<s-button theme="is-primary" :label="article.numero" icon="cog" @onclick="editArticle(article)"/>
				<br/><br/>
			</li>
		</ul>
		
	</div>
	<div :class="addViewMateriel">
			
					<editInventaireItem 
						@save="saveArticle" 
						@delete="modalDeleteArticle=true"
						@cancel="addViewMateriel='modal'"
						:article="article" 
						v-if="addViewMateriel=='modal is-active'">
					</editInventaireItem>  	
					<s-confirm :open="modalDeleteArticle" title="Supprimer l'article" @yes="deleteArticle" @no="modalDeleteArticle=false">
						Souhaitez vous réellement supprimer l'article {{article.numero}} ?
					</s-confirm>
				
	</div>
		    <!-- Brand and toggle get grouped for better mobile display -->
			<nav class="navbar is-fixed-bottom" role="navigation" aria-label="main navigation">
  			<div class="navbar-brand">
				<div class="navbar-item">
					<button class="button is-warning is-small" v-on:click="$emit('back')">
				 	<i class="fas fa-undo" ></i>
					&nbsp;&nbsp;Retourner à la liste
					</button>
				</div>
				<div class="navbar-item">
					<button class="button is-success  is-small" v-on:click="save">
					 <i class="fas fa-save"></i>
					&nbsp;&nbsp;Enregistrer
					</button>
				</div>
				<div class="navbar-item">
					<button class="button is-danger  is-small" v-on:click="archiver">
					 <i class="fas fa-trash"></i>
					&nbsp;&nbsp;Archiver
					</button>
				</div>
			</div>
		</nav>		

	 </div>
</template>
<script>
	import client from "@/firebase/client_api"
	import entrepot_api from '@/firebase/entrepot_api'	 
	import categorie_api from '@/firebase/categorie_api'
	import editInventaireItem from "@/views/client/editInventaireItem.vue";
	import article_api from "@/firebase/article_api";
	export default {
		name: 'edit_client',
		props: ["client", "change"],
		components: {
			editInventaireItem
		},
		data: function() {
			return {
				classTabInfoClient: "is-active",
				classTabMateriel: "",
				addViewMateriel: "modal",
				entrepots: [],
				categories: [],
				article: article_api.api.json_article,
				modalDeleteArticle:false
			}
		},
		methods: {
			save() {
				
				if (typeof(this.client[".key"]) =="undefined") {
					client.api.add(this.$store.getters.getDocAgence, this.client, (ref)=> {
						
					});
				}
				else {
					client.api.update(this.$store.getters.getDocAgence, this.client, ()=> {
						
					})
				}
			},
			archiver() {
				client.api.archiver(this.$store.getters.getDocAgence, this.client, ()=> {
						this.$emit("back",true)
			
				})
			},
			tabInfoClient() {
				
				this.classTabInfoClient="is-active";
				this.classTabMateriel= "";	
			},
			tabInfoMateriel() {
				this.classTabInfoClient="";
				this.classTabMateriel= "is-active";	
				this.save();
			},
			deleteArticle() {
				delete this.client.articles[this.article.id]
				this.saveArticle();
			},
			saveArticle() {		
				
				this.client.articles[this.article.numero] = this.article;
				
				article_api.api.save(this.$store, this.client,()=>{
					this.addViewMateriel = "modal";
					this.modalDeleteArticle = false;
				});
			},
			editArticle(article) {
				this.article= JSON.parse(JSON.stringify(article));
				this.addViewMateriel='modal is-active';
			},
			openAddMartiel() {
				
				this.article = JSON.parse(JSON.stringify(article_api.api.json_article));
				this.addViewMateriel='modal is-active';

			}
			
		},
		mounted() {			
			
		}		
		

	}
		

</script>
<style scoped>

.input {
	display: left
}
.tab {
	background-color: white;
	height: 600px;
	padding-top: 10px;
}
</style>