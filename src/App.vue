<template>
  <div id="app">
  	 
  	
    	<router-view>
		</router-view>
	
  </div>
</template>
<script>
export default {
	mounted() {
		const recaptcha = this.$recaptchaInstance
		if (recaptcha)
			recaptcha.hideBadge();
	}
}
</script>
<style>
	.container {
		padding-top: 10px;
	}
	body {
		overflow-y: hidden;
	}
	.grecaptcha-badge {
		bottom: 20px !important;
	}
</style>
