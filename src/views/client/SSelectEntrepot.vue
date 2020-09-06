<template>
	<s-modal 
		:open="open" 
		:title='"Selectionner un entrepot pour " + article.numero '
		:save="false" 
		:cancel="true" 
		@save="" 
		@cancel="$emit('cancel')">
		<div v-for="entrepot in $store.getters.getEntrepots" v-if="IdEntrepotSelected==null">
			<s-button theme="" :label="entrepot.nom + ' (' + entrepot.reste + ')'" icon="" @onclick="setEntrepot(entrepot)"/><br/><br/>
		</div>		
		<div v-if="IdEntrepotSelected!=null">
			<s-button theme="is-primary" icon="list" label="Revenir à la selection de l'entrepot" @onclick="IdEntrepotSelected=null">
			</s-button>
			<label class="label">Sélectioner le lieu de stockage de {{labelEntrepot}}</label>
			<div v-for="(stock, index) in $store.getters.getEntrepots[indexEntrepot].stocks">
				<s-button theme="" :label="stock.nom + ' (' + stock.reste + ')'" icon="" @onclick="setStock(index)"/><br/><br/>
			</div>
		</div>
	</s-modal>
</template>

<script>
	export default {
		props:["article", "open"],
		data: function() {
			return {
				IdEntrepotSelected : null,
				labelEntrepot : null,
				indexEntrepot: null
			}
		},
		methods: {
			setEntrepot(item) {			
				this.IdEntrepotSelected = item.id;	
				this.indexEntrepot = this.$store.getters.getEntrepots.findIndex(entrepot=>entrepot.id === this.IdEntrepotSelected);
				this.labelEntrepot = this.$store.getters.getEntrepots[this.indexEntrepot].nom;
			},
			setStock(item) {
				this.article.idEntrepot = this.IdEntrepotSelected;
				this.article.indexStock = item;
				this.IdEntrepotSelected = null;
				this.$emit("save");
			}
		}
	}

</script>