<template>
	<div class="itemAgence">
		<span class="label">{{agence.nom}}

			<div class="subscription">
				<s-button theme="is-success" :icon="getIconAbonnement()" @onclick="$emit('editSubscription',agence)" :label="agence.abonnement"/>
			</div>
		</span>
		<br/>
		<div class="checkAgence" v-show="!isAgenceSelected && agence.finish==$steps">
			<s-button @onclick="checkAgence(agence)" :icon="icon" :label="label" :theme="theme" /> 
		</div>
		
		<s-button v-show="isAgenceSelected" @onclick="editAgence(agence)" label="Configurer" :theme="theme" icon="edit">
			
		</s-button>
		
		<div class="checkAgence">
		<s-button v-show="isAgenceSelected && agence.finish==$steps" @onclick="$router.push('/list')" label="GO" :theme="theme" icon="play">
			
		</s-button>
		</div>
		<div  v-show="agence.finish!=$steps">
			<b>L'agence n'est pas finalisée. Vous êtes à l'étape {{agence.finish+1}}</b>
		</div>
		&nbsp;
		
		
	</div>
</template>
<script>
	export default {
		props: ["agence","label", "icon","theme","isAgenceSelected"],
		
		methods: {
			checkAgence(agence) {
				this.$emit("checkAgence", agence);
			},
			editAgence(agence) {
				this.$emit("editAgence", agence);	
			},
			getIconAbonnement() {
				if (this.agence.abonnement == "BABY")
					return "baby";
				if (this.agence.abonnement == "DOVE")
					return "dove";
				if (this.agence.abonnement == "SPIDER")
					return "spider";
				if (this.agence.abonnement == "DRAGON")
					return "dragon"
			}
		}
	}
</script>
<style scoped>
	.itemAgence {
		width: 350px;
		height: 120px;
		border : thin silver solid; 
		margin-bottom: 10px;
		padding: 10px;
		margin-right: 5px;
		
	}
	.checkAgence {
		float: right;
	}
	.subscription {
		
		
		float: right;
		width: 100px;
	}
</style>