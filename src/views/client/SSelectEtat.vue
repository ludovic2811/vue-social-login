<template>
	<s-modal 
		:open="open" 
		:title='"Selectionner un état pour " + article.numero '
		:save="false" 
		:cancel="false" 
		@save="" 
		@cancel="">
		<div v-for="etat in $store.getters.getAgence.etats">
			<s-button :theme="etat.id == article.idEtat ? 'is-success': ''" :label="etat.nom" :icon="etat.icon" @onclick="setEtat(etat)"/><br/><br/>
		</div>		
	</s-modal>
</template>

<script>
	export default {
		props:["article", "open"],
		
		methods: {
			setEtat(item) {				
				this.article.idEtat = item.id;
				this.$emit("save");
			}
		}
	}

</script>