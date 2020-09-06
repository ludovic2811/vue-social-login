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


  	<visu-info-materiel :modif="modif" :client="client" v-show="nav=='visuInfoMateriel'"  @edit="$emit('edit')"/>
  	<visu-info-client :modif="modif" :client="client" v-show="nav=='visuInfoClient'" @edit="$emit('edit')" />
  	
  		
  </div>
</template>
<script >
	import VisuInfoMateriel from '@/views/client/visuInfoMateriel.vue';
	import VisuInfoClient from '@/views/client/visuInfoClient.vue';
	export default {
		props: ["client", "modif"],
		components: {
			VisuInfoMateriel,
			VisuInfoClient
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
	}
</script>
