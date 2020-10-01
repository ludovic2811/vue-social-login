<template>
<nav v-if="existAgence() && existUser()" class="navbar is-fixed-bottom is-primary" role="navigation" aria-label="main navigation">
	<div  style="width: 100%">
       
		   
		<div class="search">
       <s-button theme="is-info" @onclick="changeTypeSearch()" 
          :icon="typesSearch[indexTypeSearch]" label=""/>&nbsp;
       <input type="text" id="search" class="input" :placeholder="placeHolder[indexTypeSearch]" style="width:45%" v-model="search" />
        &nbsp;&nbsp;
        <s-button label="" icon="search" theme="is-success" @onclick="searchClient"/>
        &nbsp;&nbsp;
        <s-button label="" icon="camera" theme="is-success" @onclick="openCamera=true"/>
       
        </div>
    </div>
 <div v-if="openCamera">
  <s-camera @close="openCamera=false" @captureNumero="captureNumero" />
 </div>
</nav>
</template>
<script>
import SCamera from "@/components/SCamera.vue"
import firebase from "firebase"
export default {
  name: "my-navbarbottom",
  data() {
    return {
        search: "",
        openCamera: false,
        typesSearch:  ["user","car","phone-alt"],
        placeHolder:  ["NOM","PLAQUE","TEL"],
        indexTypeSearch: 0
    }
  },
  components: {
    SCamera
  },
  methods: {
      changeTypeSearch() {
        this.indexTypeSearch ++;
        if (this.indexTypeSearch == 3)
          this.indexTypeSearch  = 0;
      },
     existUser() {
      return firebase.auth().currentUser != null;
    },
    existAgence() {
     
      if (typeof(this.$store.getters.getAgence.id) != "undefined") {
      
        if (this.$store.getters.getSubscription!=null)
          if (typeof(this.$store.getters.getSubscription.subscription) == "undefined") {
            // alors on n'est dans le cas où le client est en mode test
            return this.$store.getters.getAgence.finish == this.$steps;
          }
          else {
            if (this.$store.getters.getSubscription.subscription.status == "active")
              return this.$store.getters.getAgence.finish == this.$steps;
            else
              return false;
          }
        else  // alors on n'est dans le cas où le client est en mode test
          return this.$store.getters.getAgence.finish == this.$steps;
      }
      else
        return false;

    },
    captureNumero(numero) {
      this.search = numero;
      this.indexTypeSearch = 1;
      this.openCamera = false;
      this.searchClient();
    },
    searchClient() {
        this.search = this.search.toUpperCase();
        this.$router.push({ path: '/client', query: { search: this.search, type: this.indexTypeSearch } })
        .catch(err => {
          if (err.name !== 'NavigationDuplicated') {
              throw err;
          }
        })
    }
  }
};
</script>
<style scoped>
#search {
    text-transform: uppercase;
    color: black;
}
.search {
  padding-top: 3px;
  padding-left: 5px;
}
</style>