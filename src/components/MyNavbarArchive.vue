<template>
<nav class="navbar is-primary is-fixed-top" role="navigation" aria-label="main navigation">
  <div class="navbar-brand">
    <div  v-on:click="rout('/index')" class="navbar-item">
        <img src="@/assets/logo.png"   /><div class="s-item-menu">Guarding Manager</div>

      </div>

    <a role="button" :class="!openDrop ? burger : burgerActive" aria-label="menu" aria-expanded="false" data-target="navbarMenu"  v-on:click="openDrop=!openDrop">
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
    </a>
  </div>

  <div id="navbarMenu" :class="!openDrop ? dropdown : dropdownActive" >
    <div class="navbar-start"  v-if="existUser()">
      <div :class="!openSubDrop ? subdropdown : subdropdownActive">
         <a class="navbar-link" v-on:click="openSubDrop=!openSubDrop">
          <div class="s-item-menu">Clients</div>
        </a>
     
        <div class="navbar-dropdown is-boxed" v-on:click="openSubDrop=!openSubDrop">
            <a class="navbar-item" v-on:click="rout('/listClient')">
              <i class="fas fa-users"></i><div class="s-item-menu">Liste des clients</div>
            </a>
            <a class="navbar-item"  v-on:click="rout('/planning')">
              <i class="fas fa-calendar"></i><div class="s-item-menu">Planning</div>
            </a>
            <a class="navbar-item"  v-on:click="rout('/impaye')">
              <i class="fas fa-file-invoice-dollar"></i><div class="s-item-menu">Liste des impayés</div>
            </a>
        </div>
      </div>
      
    </div>

    <div class="navbar-end">
      
          <a class="navbar-item" v-on:click="rout('/login')" v-if="!existUser()">
               <i class="fas fa-user"></i>Se loguer
            </a>
            <a class="navbar-item" v-on:click="rout('/config')" v-if="existUser()">
                  <i class="fas fa-warehouse"></i><div class="s-item-menu">{{$store.getters.getAgence.nom}}</div>
            </a>
            <div :class="!openSubDropProfil ? subdropdownProfil : subdropdownProfilActive">
              <a class="navbar-link" v-on:click="openSubDropProfil=!openSubDropProfil">
                <div class="s-item-menu">{{getDisplayName()}}</div>
              </a>
              <div class="navbar-dropdown is-boxed"  v-on:click="openSubDropProfil=!openSubDropProfil" >                  
                  <a class="navbar-item"  v-on:click="logout()">
                    <i class="fas fa-sign-out-alt"></i><div class="s-item-menu">Se déconnecter</div>
                  </a>
              </div>
            </div>
           
        
     
    </div>
  </div>
</nav>


  
</template>

<script>
import firebase from "firebase";

export default {
  name: "my-navbar",
  data: function() {
      return {        
        menuLogin: "dropdown",
        
        dropdown: "navbar-menu",
        dropdownActive : "navbar-menu is-active",
        burger: "navbar-burger burger",
        burgerActive : "navbar-burger burger is-active",
        openDrop: false,

        subdropdown: "navbar-item has-dropdown",
        subdropdownActive : "navbar-item has-dropdown is-active",
        openSubDrop: false,

        subdropdownProfil: "navbar-item has-dropdown",
        subdropdownProfilActive : "navbar-item has-dropdown is-active",
        openSubDropProfil: false
        
      }
  },
  methods: {
    rout(nav) {
      this.$router.push(nav).catch(error=>{})
    },
    
    existUser() {
      
      return firebase.auth().currentUser != null;
    },
    getDisplayName () {
      return firebase.auth().currentUser.displayName;
    },
    logout: function() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.$router.replace("login");
        });
    }
  }
};
</script>
<style scoped>
  .s-item-menu {
    display: inline-block;
    padding-left: 10px;

  }
</style>