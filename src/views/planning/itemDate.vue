<template>
	<s-modal :open="open" :title="date" :save="false" :cancel="false" :close="true" @save="" @cancel="" @close="$emit('close')">
		<div class="tabs is-large is-boxed is-toggle-rounded is-fullwidth">
		  <ul>
		    <li :class=" (InOut=='rentrele') ? 'is-active' : ''" v-on:click="InOut = 'rentrele'">
		    	<a >
		    		<span class="icon is-small">
		    			<i class="fa fa-arrow-circle-right"/>&nbsp;&nbsp;
		    			<span class="subtitle is-6">Doit rentrer</span>&nbsp;&nbsp;
		    		</span>
		    	</a>
		    </li>
		    <li :class=" (InOut=='partirle') ? 'is-active' : ''"  v-on:click="InOut = 'partirle'">
		    	<a>
		    		<span class="icon is-small">
		    			<i class="fa fa-arrow-circle-left"/>&nbsp;&nbsp;
		    			<span class="subtitle is-6">Doit partir</span>&nbsp;&nbsp;
		    		</span>
		    	</a>
		    </li>
		  </ul>
		</div>
		<div class="item">
			<ul>
				<li v-for="client in clients[InOut]">
					<div v-for="article in client.articles" class="itemArticle">
						<span v-if="article[InOut]==date">
							<s-button icon="eye" label="" theme="is-primary" @onclick="openClientItem(client)"/>&nbsp;&nbsp;&nbsp;
							<div style="width:100px;display:inline-block">
								{{client.nom}} {{client.prenom}} :
							</div>
							<i :class="getClassCategorie(article.idCategorie)"/> {{article.numero}}</span>

							<div style="float:right">
							<s-button :label="getLabelEtat(article.indexEtat)" :icon="getClassEtat(article.indexEtat)" theme="is-primary " @onclick="openModalEtat=true"/>
							<s-select-etat :open="openModalEtat" :article="article"
								@save="save(client)" @cancel="openModalEtat=false"
							>
							</s-select-etat>
							</div>
					</div>
				</li>
			</ul>
		</div>
		<s-modal :open="openClient" title="Client" :save="false" :cancel="false" :close="true" @save="" @cancel="" @close="openClient=false">
		<visu-item-client :client="client" @edit="" v-if="client!=null" :modif="false">
		</visu-item-client>
		</s-modal>
	</s-modal>
</template>
<script>
	import VisuItemClient from '@/views/client/visuItemClient.vue'
	import SSelectEtat from '@/views/client/SSelectEtat.vue'
	import client_api from "@/firebase/client_api"
	export default {
		props:["date","clients", "open"],
		data: function() {
			return {
				InOut: "rentrele",
				openModalEtat: false,
				client: null,
				openClient: false
			}
		},
		components: {
			SSelectEtat,
			VisuItemClient
		},
		methods: {
			openClientItem(client) {
				this.client = client;
				this.openClient = true;
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
			getLabelEtat(indexEtat) {
				var index = this.$store.getters.getEtats.findIndex(elt=>elt.id == indexEtat);
				if (index!=-1) {
					return this.$store.getters.getEtats[index].nom;
				}
				return "";
			},
			save(client) {
				client_api.api.update(this.$store.getters.getDocAgence, client, ()=> {
					this.openModalEtat=false;
				})
			}

		}
	}
</script>
<style scoped>
	.itemArticle {
		margin-bottom: 20px;
	}
</style>