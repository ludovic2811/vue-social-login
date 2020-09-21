<template>
	<div class="container">
		<s-modal :open="errorAdd" title="" close="true" @close="errorAdd=false">
			<div class="notification is-danger">
			Un problème est survenu lors de la création de ce client <br/><br/>
			Il se peut que votre abonnnement soit trop limité !
			</div>
		</s-modal
>

		<div class="field">		 
		    <input class="input is-rounded" type="text" placeholder="Nom du client" v-model="client.nom">		 		  
		</div>
		<div class="notification is-danger" v-show="errorNom">
	      <button class="delete" v-on:click="errorNom=false"></button>
			Il faut au moins mettre le nom du client !
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
				<s-button theme="is-primary" 
					:label="article.numero" afterIcon="cog" 
					:icon="getIconCategorie(article)"
					@onclick="editArticle(article)"/>
					
				<br/><br/>
			</li>
		</ul>
		
	</div>
	<in-out
			:client="client"
			:article="article"
			@close="closeInOut"
			:open="openInOut"
				>
	</in-out>	
	<histoPaiement 
			:article="article" 
			:client="client"
			:open="openHistoPaiement" 
			@close="closeHistoPaiement"
		>
	</histoPaiement>	
	<div :class="addViewMateriel">
			
		<edit-article 
			@save="saveArticle" 
			@delete="modalDeleteArticle=true"
			@cancel="addViewMateriel='modal'"
			@openHisto="openHisto"
			@openInOut="openModalInOut"
			:article="article" 
			:client="client"
			v-if="addViewMateriel=='modal is-active'">
		</edit-article >  
		
		

		<s-confirm 
			:open="modalDeleteArticle" 
			title="Supprimer l'article" 
			@yes="deleteArticle" @no="modalDeleteArticle=false">
			Souhaitez vous réellement supprimer l'article {{article.numero}} ?
		</s-confirm>
				
	</div>
		    <!-- Brand and toggle get grouped for better mobile display -->
			<nav class="navbar is-fixed-bottom is-primary" role="navigation" aria-label="main navigation">
  			<div class="navbar-brand">
				<div class="navbar-item">
					<s-button theme="is-success is-small" icon="save" label="Enregistrer" @onclick="save"/>
				</div>
				<div class="navbar-item">
					<s-button theme="is-warning is-small" icon="ban" label="Annuler" @onclick="$emit('back')"/>
				</div>
				<div class="navbar-item">
					<s-button theme="is-danger is-small" icon="trash" label="Supprimer" @onclick="archiver"/>
				</div>
			</div>
		</nav>		

	 </div>
</template>
<script>
	
	import client 			from "@/firebase/client_api"
	import article_api 		from "@/firebase/article_api";
	import agence_api 		from "@/firebase/agence_api";
	import entrepot_api 	from '@/firebase/entrepot_api'	 
	import categorie_api 	from '@/firebase/categorie_api'
	import etat_api 		from '@/firebase/etat_api'

	import conso 			from "@/firebase/client_consolidation"; 
	
	import EditArticle 		from "@/views/client/edit/editArticle.vue";
	import histoPaiement 	from '@/views/client/components/historiquePaiement.vue'
	import InOut            from '@/views/client/components/inOut.vue'
	export default {
		name: 'edit_client',
		props: ["client", "change"],
		components: {
			EditArticle,
			histoPaiement,
			InOut
		},
		data: function() {
			return {
				classTabInfoClient: "is-active",
				classTabMateriel: "",
				addViewMateriel: "modal",
				entrepots: [],
				categories: [],
				article: article_api.api.json_article,
				modalDeleteArticle:false,
				openHistoPaiement: false,
				openInOut: false,
				errorNom: false,
				errorAdd: false
			}
		},
		methods: {
			getIconCategorie(article) {
				return this.$store.getters.getAgence.categories[article.idCategorie].icon;
			},
			
			save(fct) {
				if (this.client.nom == "") 
					this.errorNom = true;
				
				if (!this.errorNom) {
					if (typeof(this.client[".key"]) =="undefined") {
						client.api.add(this.$store, this.client, (ref, error)=> {
							this.errorAdd = error;
							
							if (!error)
								this.client['.key'] = ref.id;
							if (typeof(fct) != "undefined")
								fct(error);
							
						});
					}
					else {
						client.api.update(this.$store, this.client, ()=> {
							if (typeof(fct) != "undefined")
								fct(this.errorNom);
						})
					}
				}
				else {
					if (typeof(fct) != "undefined")
						fct(this.errorNom);
				}
					
			},
			archiver() {
				client.api.archiver(this.$store, this.client, ()=> {
						this.$emit("back",true)
			
				})
			},
			tabInfoClient() {
				
				this.classTabInfoClient="is-active";
				this.classTabMateriel= "";	
			},
			tabInfoMateriel() {
				this.save(error=>{
					if (!error) {
						this.classTabInfoClient="";
						this.classTabMateriel= "is-active";	
					}
				})
				
				
			},
			openHisto(article) {
				
				this.article = article;
				this.openHistoPaiement = true;
			},
			openModalInOut(article) {
				console.log("openHisto")
				this.article = article;			
				this.openInOut = true;
			},
			closeHistoPaiement() {
				this.openHistoPaiement = false;
				this.addViewMateriel = "modal";
				this.editArticle(this.article);
			},
			closeInOut() {
				this.openInOut = false;
				this.addViewMateriel = "modal";
				this.editArticle(this.article);
			},
			deleteArticle() {
				var articleDelete = JSON.parse(JSON.stringify(this.client.articles[this.article.numero]));
				// il faut supprimer dans historique de paiement & dans le planning
				article_api.api.delete(this.$store, this.client, this.article);
				this.saveArticle(this.client.articles[this.article.id], articleDelete);
			},
			saveArticle(articleModif, articleDelete) {		
				var articleOld;
				var deleteArticle = false;
				var newArticle = false;
				if (typeof(articleDelete) != "undefined") {
					deleteArticle = true;
					articleOld = articleDelete;
				}
				else {
					articleOld = this.client.articles[articleModif.numero];
					if (typeof(articleOld) == "undefined")
						newArticle = true;
				}
					
				
				conso.api.calculEspaceEntrepot (this.$store.getters.getAgence, articleModif, articleOld, (modif)=>{
					if (typeof(articleModif) != "undefined")
						this.client.articles[articleModif.numero] = articleModif;
				
					article_api.api.save(this.$store, this.client,()=>{
						this.addViewMateriel = "modal";
						
						etat_api.api.incNbArticle(this.$store,articleModif);
						etat_api.api.decNbArticle(this.$store, articleOld);
						if (newArticle) {
							agence_api.api.incNbArticle(this.$store, ()=>{
								
							})
							
						}
						else if (deleteArticle) {
							agence_api.api.decNbArticle(this.$store, ()=>{
								this.modalDeleteArticle = false;
							})							
						}
					});

				});
				
			},
			editArticle(article) {
				this.article= JSON.parse(JSON.stringify(article));
				this.addViewMateriel = 'modal is-active';
			},
			openAddMartiel() {
				this.article = JSON.parse(JSON.stringify(article_api.api.json_article));
				this.addViewMateriel = 'modal is-active';
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