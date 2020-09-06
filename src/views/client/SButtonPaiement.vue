<template>

	<div>
	<input type="hidden" :value="change"/>
	<s-button 
		:theme="getTheme()" 
		:label="getLabel()" 
		@onclick="$emit('onclick')"
		:icon="getIcon()">				
	</s-button>

</div>
</template>
<script>
export default {
	props:["article","change"],
	methods: {
		
		getYear() {
				var now = new Date();
				return now.getFullYear();
		},
		getLabel() {			
			if (this.payer() == 0)
				return "N'a pas payé pour " + this.getYear();
			if (this.payer() == 1)
				return "payé en partie pour " + this.getYear();
			if (this.payer() == 2)
				return "Payé pour " + this.getYear();			
		},
		getTheme() {
			if (this.payer() == 0)
				return " is-danger is-small "
			if (this.payer() == 1)
				return " is-warning is-small "
			if (this.payer() == 2)
				return " is-success is-small ";
		},
		getIcon() {
			if (this.payer() == 0)
				return "times"
			if (this.payer() == 1)
				return "exclamation-circle"
			if (this.payer() == 2)
				return "check";
		},
		payer() {
			var year  =this.getYear();
			var payer = 0;
			if (typeof(this.article.paiements) != "undefined") {
				if (typeof(this.article.paiements[year]) != "undefined") {
					if (!this.article.paiements[year].confirm)
						payer = 1;
					else 
						payer = 2;					
				}
			}
			return payer;
		}
	}
	
}
</script>