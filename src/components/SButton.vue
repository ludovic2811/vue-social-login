<template>
	<button :class="'button is-rounded ' + theme" v-on:click="click" :disabled="disabledComputed" >
		<span class="icon" v-if="icon">
			<i :class="'fas fa-' + icon"></i>			
		</span>
		<span v-if="label!=''">
			{{label}} 
		</span>
		<span class="afterIcon"  v-if="afterIcon">
			&nbsp;&nbsp;<i :class="'fas fa-' + afterIcon"></i>			
		</span>
	</button> 
</template>
<script>
	export default {
		props: ["icon", "label","theme","afterIcon", "disabled"],
		methods: {
			click() {
				
				this.$emit("onclick");
			}
		},
		computed: {
			disabledComputed: function() {
				if (typeof(this.disabled) == "undefined")
					return false;
				else
					return this.disabled
			}
		}
	}
</script>