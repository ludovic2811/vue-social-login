<template>
	<div class="container">
	<nav class="level is-mobile">
		<div class="level-left"> 
			<div class="level-item">
				<p class="subtitle is-5">{{client.nom}} {{client.prenom}}</p>
				
				
			</div>
		</div>
		<div class="level-rigth">
			<button class="button is-small is-primary is-rounded" v-on:click="call(client.tel1)" v-if='client.tel1 != ""'>
			<span class="numtel">{{client.tel1}}</span>
			&nbsp;&nbsp;<i class="fa fa-phone"/>
		</button>&nbsp;
		</div>
	</nav>
	
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


  	<tab-article 
	 	:modif="modif" 
	  	:client="client" 
	  	v-show="nav=='visuInfoMateriel'"  
	  	@edit="$emit('edit')"
	  	@openModalInOut="openModalInOut" 
		@openModalHistoPaiement="openModalHistoPaiement" ></tab-article>

  	<tab-client 
		:modif="modif" 
		:client="client" 
		v-show="nav=='visuInfoClient'" 
		@edit="$emit('edit')" ></tab-client>
  
  		
  </div>
</template>
<script >
	import TabArticle 	from '@/views/client/tabArticle.vue';
	import TabClient 	from '@/views/client/tabClient.vue';
	
	export default {
		props: ["client", "modif"],
		components: {
			TabArticle,
			TabClient
		},
		data: function() {
			return  {
				nav: "visuInfoMateriel",
				classTabInfoClient: "",
				classTabMateriel: this.classOK,
				classOK : "is-active"
			}
		},
		methods: {
			
			openModalHistoPaiement(client, article) {
				this.$emit("openModalHistoPaiement", client, article);
			},
			openModalInOut (client, article) {
				this.$emit("openModalInOut", client, article);
			},
			tabInfoClient() {
				this.nav='visuInfoClient';
				this.classTabInfoClient=this.classOK;
				this.classTabMateriel= "";	
			},
			tabInfoMateriel() {
				this.nav='visuInfoMateriel';
				this.classTabInfoClient="";
				this.classTabMateriel= this.classOK;	
			},
			
			call (tel) {
  			window.location.href = "tel:"+tel;
  		},
  			mailto (mail) {
  			window.location.href = "mailto:"+mail;
  		},
  			addInventaireItem(clientItem) {
  				this.clientData = clientItem;
  				this.nav = 'addItem';

  			}
		},
		mounted() {
			this.classTabMateriel= this.classOK;
		}
	}
</script>
<style scoped>
.requestTest {
	width: 300px;
	height: 100px;
	overflow-x: auto;
	
}
</style>
