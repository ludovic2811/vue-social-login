<template>
	<s-modal 
		:open="open" 
		:title='"Selectionner un entrepot pour " + article.numero '
		:save="false" 
		:cancel="true" 
		@save="" 
		@cancel="$emit('cancel')">
		<div v-for="entrepot in dataCollectionArray" v-if="IdEntrepotSelected==null">
			<s-button theme="" 
				:label="entrepot.object.nom + ' (' + entrepot.object.reste + ')'" icon="" 
				@onclick="setEntrepot(entrepot.object)"/><br/><br/>
		</div>		
		<div v-if="showListStock && IdEntrepotSelected!=null">
			<s-button theme="is-primary is-small" icon="list" label="Revenir à la selection de l'entrepot" 
			@onclick="back">
			</s-button><br/><br/>
			<label class="label">Lieu de stockage de {{labelEntrepot}}</label>
			<div v-for="stock in dataCollectionArrayStocks">
				<s-button theme="" :label="stock.object.nom + ' (' + stock.object.reste + ')'" icon="" @onclick="setStock(stock.object.id)"/><br/><br/>
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
				showListStock: false,
				dataCollectionArray: [],
				dataCollectionArrayStocks: [],
			}
		},
		watch: {
			open: function(val) {
				this.dataCollectionArray = 	this.$orderJson(this.$store.getters.getAgence.entrepots);
			}
		},
		methods: {
			back() {
				this.showListStock = true;
				this.IdEntrepotSelected  =null;
			},
			setEntrepot(item) {			
				this.IdEntrepotSelected = item.id;	
				this.labelEntrepot = this.$store.getters.getAgence.entrepots[this.IdEntrepotSelected].nom;
				this.dataCollectionArrayStocks = this.$orderJson(this.$store.getters.getAgence.entrepots[this.IdEntrepotSelected].stocks);
				this.showListStock = true;
			},
			setStock(idStock) {
				this.article.idEntrepot = this.IdEntrepotSelected;
				this.article.idStock = idStock;
				this.IdEntrepotSelected = null;
				this.$emit("save");
				
			}
		},		
		mounted() {
			this.dataCollectionArray = 	this.$orderJson(this.$store.getters.getAgence.entrepots);
		}
	}

</script>