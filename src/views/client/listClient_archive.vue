<template>
<span>
	<h1 class="subtitle">&nbsp;Gestion de vos clients</h1>
	
	

	
  	
  	<div v-if="nav=='list'">
	<v-client-table :data="clients" :columns="columns" :options="options" >
	     <template slot="call" slot-scope="props">
			    <div>
			        <button class="button fa fa-phone is-medium is-primary is-rounded" v-on:click="call(props.row.tel1)">
			        	
			        </button>
			        &nbsp;&nbsp;
			        <button class="button fa fa-envelope is-medium is-primary is-rounded" v-on:click="mailto(props.row.mail1)"></button>
			        &nbsp;&nbsp;
			        <button class="button fa fa-eye  is-medium is-rounded is-primary" v-on:click="showClient(props.row.id)"></button>
			       
			    </div>
		 </template>
	 </v-client-table>
	</div>

	 <edit-client :client="clientData" v-if="nav=='edit'" @back="refresh"/>

	 <visu-client :client="clientData" v-if="nav=='visu'" @back="refresh"/>

	 <div :class="dialogEditClient">
	  <div class="modal-background"></div>
	  <div class="modal-card">
	    <header class="modal-card-head">
	      <p class="modal-card-title">Créer un client</p>
	      <button class="delete" aria-label="close"  v-on:click="openOrCloseModalEditClient"></button>
	    </header>
	    <section class="modal-card-body">
	      <!-- Content ... -->
	    </section>
	    <footer class="modal-card-foot">
	      <button class="button is-success">Save changes</button>
	      <button class="button">Cancel</button>
	    </footer>
	  </div>
	</div>
	
</span>
</template>
<script>

import client from '@/firebase/client_api'
import client from '@/firebase/compte_api'
import EditClient from '@/views/client/editClient.vue'
import VisuClient from '@/views/client/visuClient.vue'

export default {
  name: "clist_client",
  components: {
  	EditClient,
  	VisuClient
  },
  data: function() {
  	return {
  		nav: 'list',
  		clientData: client.api.json,
  		dialogEditClient: 'modal',
  		clients: [],
  		columns: ['nom',   'call'],
  		options: {
  			filterable: ['nom', 'tel1'],
  			
  			sortable: ['nom','prenom'],
  			headings: {
	  			nom: "Nom",
	  			prenom: "Prénom",
	  			tel1: "Téléphone",
	  			call: ""
	  		}
  		}
  	}
  },
  mounted: function() {
  	compte_api.api.get(account=> {
		      	this.account = account;
    			client.api.getAll(this.account.id, clients=>{
    				this.clients = clients;
    			console.log(this.clients);
    		});
    })
    
  },
  methods: {
  		call (tel) {
  			window.location.href = "tel:"+tel;
  		},
  		mailto (mail) {
  			window.location.href = "mailto:"+mail;
  		},
  		openOrCloseModalEditClient() {  			
  			if (this.dialogEditClient == 'modal')
  				this.dialogEditClient += " is-active";
  			else
  				this.dialogEditClient = 'modal'
  		},
  		showClient(idClient) {
  				client.api.get(idClient, clientParam=> {
  						this.clientData = clientParam;
  						this.nav='visu';
  				});
  		},
  		refresh(refreshTrue) {
  			this.nav='list';
  			if (refreshTrue)
  				client.api.getAll(clients=>{
    					this.clients = clients;
				    });
  		},
  		addClient() {
  			this.clientData = client.api.json
  			this.nav='edit';
  		}
	}
};
</script>
</script>
<style>

</style>