<template>
	<s-modal 
		:open="open" 
		:title='"Selectionner un entrepot pour " + article.numero '
		:save="false" 
		:cancel="true" 
		@save="" 
		@cancel="$emit('cancel')">
		<div v-for="entrepot in $store.getters.getAgence.entrepots" v-if="IdEntrepotSelected==null">
			<s-button theme="" :label="entrepot.nom + ' (' + entrepot.reste + ')'" icon="" @onclick="setEntrepot(entrepot)"/><br/><br/>
		</div>		
		<div v-if="showListStock && IdEntrepotSelected!=null">
			<s-button theme="is-primary" icon="list" label="Revenir à la selection de l'entrepot" 
			@onclick="showListStock=false">
			</s-button>
			<label class="label">Sélectioner le lieu de stockage de {{labelEntrepot}}</label>
			<div v-for="stock in $store.getters.getAgence.entrepots[IdEntrepotSelected].stocks">
				<s-button theme="" :label="stock.nom + ' (' + stock.reste + ')'" icon="" @onclick="setStock(stock.id)"/><br/><br/>
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
				indexEntrepot: null,
				showListStock: false
			}
		},
		methods: {
			setEntrepot(item) {			
				this.IdEntrepotSelected = item.id;	
				this.labelEntrepot = this.$store.getters.getAgence.entrepots[this.IdEntrepotSelected].nom;
				this.showListStock = true;
			},
			setStock(idStock) {
				this.article.idEntrepot = this.IdEntrepotSelected;
				this.article.idStock = idStock;
				this.IdEntrepotSelected = null;
				this.$emit("save");
				
			}
		}
	}

</script>