<template>
<nav  class="navbar is-fixed-bottom is-primary" role="navigation" aria-label="main navigation">
	<div class="bar">
        <div class="navbar-item">
		    <!-- Brand and toggle get grouped for better mobile display -->
		<input type="text" id="search" class="input" placeholder="NOM ou TEL ou NUMERO" style="width:70%" v-model="search" />
        &nbsp;&nbsp;
        <s-button label="" icon="search" theme="is-warning" @onclick="searchClient"/>
        &nbsp;&nbsp;
        <s-button label="" icon="camera" theme="is-warning" @onclick=""/>
        </div>
    </div>
	
</nav>
</template>
<script>
export default {
  name: "my-navbarbottom",
  data() {
    return {
        search: ""
    }
  },
  methods: {
    searchClient() {
        this.search = this.search.toUpperCase();
        //this.$router.push({path: "/listClient"});
      
        this.$router.push({ path: '/listClient', query: { search: this.search } })
    }
  }
};
</script>
<style scoped>
#search {
    text-transform: uppercase
}
</style>