<template>
<nav v-if="existAgence() && existUser()" class="navbar is-fixed-bottom is-primary" role="navigation" aria-label="main navigation">
	<div class="bar">
        <div class="navbar-item">
		    <!-- Brand and toggle get grouped for better mobile display -->
		<input type="text" id="search" class="input" placeholder="NOM ou TEL ou NUMERO" style="width:60%" v-model="search" />
        &nbsp;&nbsp;
        <s-button label="" icon="search" theme="is-warning" @onclick="searchClient"/>
        &nbsp;&nbsp;
        <s-button label="" icon="camera" theme="is-warning" @onclick="openCamera=true"/>
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
        openCamera: false
    }
  },
  components: {
    SCamera
  },
  methods: {
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
        else
          return false;
      }
      else
        return false;

    },
    captureNumero(numero) {
      this.search = numero;
      this.openCamera = false;
      this.searchClient();
    },
    searchClient() {
        this.search = this.search.toUpperCase();
        this.$router.push({ path: '/client', query: { search: this.search } })
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
    text-transform: uppercase
}
</style>