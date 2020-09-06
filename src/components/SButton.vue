<template>
	<button :class="'button ' + theme" v-on:click="click" >
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
		props: ["icon", "label","theme","afterIcon"],
		methods: {
			click() {
				
				this.$emit("onclick");
			}
		}
	}
</script>