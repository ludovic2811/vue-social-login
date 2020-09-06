<template>
	<div >
		
	  	<div class="item">
	  		<div v-show='client.tel2 != ""'>
				<button class="button is-small is-primary is-rounded" v-on:click="call(client.tel2)"  >
					<span class="numtel">{{client.tel2}}</span>
					&nbsp;&nbsp;<i class="fa fa-phone"/>
				</button>
				<br/><br/>
			</div>
			<div v-show='client.tel3 != ""'>
				<button class="button is-small is-primary is-rounded" v-on:click="call(client.tel3)"  >
					<span class="numtel">{{client.tel3}}</span>
					&nbsp;<i class="fa fa-phone"/>
				</button>
				<br/><br/>	
			</div>
			<div v-show='client.mail != ""'>
				<button class="button is-small is-primary is-rounded" v-on:click="mail(client.mail)" >
					<span class="numtel">{{client.mail}}</span>
					&nbsp;<i class="fa fa-envelope"/>
				</button><br/><br/>			  
			</div>
			<div v-show='client.adresse != ""'>
				<div class="adresse">{{client.adresse}}</div><br/>
			</div>
	  	</div>
	  	<footer class="footer is-primary">
			<div class="content has-text-centered">
				<p>
				  <!-- Brand and toggle get grouped for better mobile display -->
					<button class="button is-normal is-primary is-rounded" v-on:click="$emit('edit')"  v-if="modif">
						<i class="fa fa-edit"/>&nbsp;
						<span  >Modifier</span>
					</button>	
      			</p>
      		</div>
		</footer>
	 </div>
	
</template>
<script>
	export default {
		props: ["client","modif"]
	}
</script>
<style scoped>
	.footer {
		padding-top: 5px;
		padding-bottom: 5px;
		background-color: white;
	}
	.item {
		background-color: #F2F3F4;
		padding: 10px;
		height: 250px;
		text-align: left;
		border-radius: 10px;
	}
</style>