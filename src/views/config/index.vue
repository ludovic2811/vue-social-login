<template>
	<div class="container">
			<s-button @onclick="createAgence" icon="plus" label="Créer une nouvelle agence" theme="is-primary">
			</s-button>
			<br/><br/>
			<ul>
				<li v-for="agence in agences">
					<item-agence 
						:label="(agence.id == $store.getters.getUser.idAgenceSelected) ? 'Sélectionnée' : 'Sélectioner'" 
						:icon="(agence.id == $store.getters.getUser.idAgenceSelected) ? 'check' : 'ban'"
						:theme="(agence.id == $store.getters.getUser.idAgenceSelected) ? 'is-primary' : 'is-danger'"
						:agence="agence"
						:isAgenceSelected="agence.id == $store.getters.getUser.idAgenceSelected"
						@checkAgence="checkAgence"
						@editAgence="editAgence"
						@editSubscription = "editSubscription"
					/>
				</li>
			</ul>
			<div :class="classModal">
				<tunnel-create-agence 
					:initEtape = "etape"
					:agence="agence" 					
					@close="refresh"
					@checkAgence="checkAgence"
					 >
				</tunnel-create-agence>
			</div>
		
		
	</div>

</template>
<script>
	import agence_api 			from '@/firebase/agence_api'	
	import user_api 			from '@/firebase/user_api'	
	
	import ItemAgence 			from '@/views/config/itemAgence.vue'	
	import TunnelCreateAgence 	from '@/views/config/tunnelCreateAgence.vue'
	

	export default {
		data: function() {
			return {
				agence: agence_api.api.json,
				agences: [],
				classModal: "modal",
				etape: 0
			}
		},
		components: {
			TunnelCreateAgence,
			ItemAgence
		},
		methods: {
			editSubscription (agence) {
				this.agence = agence;
				this.etape = 6;
				this.classModal = "modal is-active";
			},
			checkAgence(agence) {
				var params = {
							idAgence: agence.id,
							fct: ()=>{								
								//fct(true);
							}
						}
				this.$store.dispatch("setAgence", params);
			},		
			getLabel(agenceSelected) {				
				if (agenceSelected)
						return 'Agence sélectionnée'
					else
						return 'Agence non sélectionnée'
			},
			editAgence(agence) {
				this.agence = agence;				
				if (this.agence.finish == this.$steps)
					this.etape = 0;
				else
					this.etape = this.agence.finish;
				console.log(this.agence.finish);
				console.log(this.etape);
				if (this.classModal == "modal")
					this.classModal = "modal is-active";
				else
					this.classModal = "modal";
				
			},				
			createAgence() {
				this.agence= JSON.parse(JSON.stringify(agence_api.api.json));
				this.etape = 0;
				if (this.classModal == "modal")
					this.classModal = "modal is-active";
				else
					this.classModal = "modal";
			},			
			refresh() {				
				this.agences=[];
				agence_api.api.getAll(this.$store, agence=> {
					var agenceData = agence;
					this.agences.push(agence);
					this.classModal='modal'
				});

			}
		},
		mounted() {
			this.refresh();
		}
	}
</script>
<style scoped>
	
	.nextEtape {
		float:right;
	}
	.beforeEtape {
		float:left;
	}
	
</style>