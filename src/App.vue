<template>
  <div id="app">
  	 <my-navbar ></my-navbar>
	 <my-navbarFooter ></my-navbarFooter>
  	
    	<router-view>
		</router-view>
	
  </div>
</template>

<style>
	.container {
		padding-top: 10px;
	}
	body {
		overflow-y: hidden;
	}
</style>
