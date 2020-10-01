<template>
	<s-modal 
		:open="open" 
		:title='"Selectionner un état pour " + article.numero '
		:save="false" 
		:cancel="false" 
		@save="" 
		@cancel="">
		<div v-for="etat in dataCollectionArray">
			<s-button :theme="etat.object.id == article.idEtat ? 'is-success': ''" 
				:label="etat.object.nom" :icon="etat.object.icon" @onclick="setEtat(etat.object)"/><br/><br/>
		</div>
		<div class="notification is-warning" v-show="!isEtatOk()">
			<i class="fas fa-exclamation"></i>&nbsp;&nbsp;L'état de votre article n'est pas cohérent avec les dates de planification
		</div>
	</s-modal>
</template>

<script>
	export default {
		props:["article", "open"],
		data() {
			return {
				dataCollectionArray : []
			}
		},
		methods: {
			isEtatOk() {
				var etat  = this.$store.getters.getAgence.etats[this.article.idEtat];
				var date = new Date();
				if (etat.out) {
					if (date >= this.article.departLe && date<this.article.rentreLe)
						return true;
					else	
						return false;
				}
				else
					if (date < this.article.departLe || date>this.article.rentreLe)
						return true;
					else	
						return false;
			},
			setEtat(item) {				
				this.article.idEtat = item.id;
				this.$emit("save");
			}
		},
		mounted() {
			this.dataCollectionArray = 	this.$orderJson(this.$store.getters.getAgence.etats);
		}
	}

</script>