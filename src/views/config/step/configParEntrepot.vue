<template>
 <div class="home has-background-white-ter">
    <my-navbar @setNav="setNav"></my-navbar>
   <h1 class="subtitle">Configurer votre hébergement</h1>
	<section class="section">
    <div class="container">
      <h1 class="title">Configurer les catégories d'articles à stocker</h1>
      <h2 class="subtitle">
        Ici, vous pouvez configurer tous les catégories de articles: en ajouter, en supprimer ou les modifier à votre guise.
        (Caravane, Camping car, voiture, chien, chat ...)
        Pour chaque catégorie, vous devrez définir également des types et son tarif par défault !
      </h2>
    </div>
  </section>
   <section class="section">
    <div class="container">
      <h1 class="title">Configurer vos lieux de stockages</h1>
      <h2 class="subtitle">
        Vous pouvez ici configurer vos lieux de stockages
      </h2>
    </div>
  </section>
   <section class="section">
    <div class="container">
      <h1 class="title">Configurer les états des articles de vos clients</h1>
      <h2 class="subtitle">
    
      </h2>
    </div>
  </section>
  <section class="section">
    <div class="container">
      <h1 class="title">Configurer vos alertes (ou évènements)</h1>
      <h2 class="subtitle">
       
      </h2>
    </div>
  </section>
   <section class="section">
    <div class="container">
      <h1 class="title">Ajouter vos collaborateurs</h1>
      <h2 class="subtitle">
       
      </h2>
    </div>
  </section>
  </div>
</template>

<script>
import firebase from "firebase";
import client from '@/firebase/client_api'

import MyNavbar from "@/components/MyNavbar.vue";
//import MyNavbarFooter from "@/components/MyNavbarFooter.vue";

export default {
  name: "home",
  components: {
    MyNavbar    /*,
    MyNavbarFooter*/
  },
  data: function() {
    return {
      nav: ""    
    }
  }
  ,
  methods:  {
    setNav(nav) {
      this.nav = nav;
    }
  }
};
</script>
