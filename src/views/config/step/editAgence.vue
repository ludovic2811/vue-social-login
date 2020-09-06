<template>
	<div>
	<label class="label" >
		Nom de l'agence :
		<input type="text" class="text" v-model="agence.nom"/>
		<div class="notification is-danger" v-show="errorNom">
			<button class="delete" v-on:click="errorNom=false"></button>
			Le nom est obligatoire !
		</div>
	</label>
	<br/>
	<label class="label" >
	Créer l'agence en 7 étapes :
		<ul class="listStep">
			<li v-for="(step, index) in steps">Etape {{index+1}} : 
				<i :class="'fas fa-'+step.icon+' is-small'"></i>
				&nbsp;&nbsp;{{step.description}}</li>
		</ul>
	</label>
	</div>
</template>
<script>
	import agence_api 		from '@/firebase/agence_api'
	export default {
		props: ["agence","steps"],
		data: function() {
			return {
				errorNom : false
			}
		},
		methods: {			
			save(fct) {
				if (this.agence.nom.length > 0 )
					agence_api.api.save(this.$store, this.agence, ()=>{
						//console.log("AFTER SAVE");
						//console.log(JSON.parse(JSON.stringify(this.agence)));
						var params = {
							idAgence: this.agence.id,
							fct: ()=>{								
								fct(true);
							}
						}
						this.$store.dispatch("setAgence", params);
					});
				else {
					this.errorNom = true;
					fct(false); 
				}
			},	
		},
		mounted() {
			console.log(this.agence);
		}
	}
</script>
<style scoped>
	.listStep li {
		padding-top: 5px;
	}
</style>