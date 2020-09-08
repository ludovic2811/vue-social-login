<template>
 <div >
  <div class=" listOffer is-mobile">
      <div class="itemOffer">
          <h1 class="title">
              <i class="fas fa-baby is-large">
              </i>&nbsp;&nbsp; L'offre BABY
          </h1>
          <div>
              Commencez par tester le produit  !              
          </div>
          <div>
              Limiter à 5 clients !
          </div>
          <div>C'est gratuit ! 
          </div>          <button class="button is-primary" v-on:click="abonner('BABY')" v-if="agence.abonnement != 'BABY'">
              <i class="fas fa-check"/>&nbsp;
              <span>Je souscris</span>
          </button>
          <b v-if="agence.abonnement == 'BABY'">
            Vous avez choisi cet abonnement !
          </b>
      </div>
       <div class=" itemOffer">
          <h1 class="title">
               <i class="fas fa-dove">
              </i>&nbsp;&nbsp; L'offre DOVE
          </h1>
          <span>
              Limiter à 150 clients
          </span>          
          <div>
            10€ par mois
          </div><br/>
          <button class="button is-primary" v-on:click="abonner('DOVE')" v-if="agence.abonnement != 'DOVE'">
              <i class="fas fa-check"/>&nbsp;
              <span>Je souscris</span>
          </button>
           <b v-if="agence.abonnement == 'DOVE'">
            Vous avez choisi cet abonnement le 
          </b>
      </div>
      <div class=" itemOffer">
          <h1 class="title">
                <i class="fas fa-spider"></i>&nbsp;&nbsp;L'offre SPIDER
          </h1>
          <span>
              Limiter à 500 clients
          </span>         
          <div>
            25€ par mois
          </div><br/>
          <button class="button is-primary" v-on:click="abonner('SPIDER')" v-if="agence.abonnement != 'SPIDER'">
              <i class="fas fa-check"/>&nbsp;
              <span>Je souscris</span>
          </button>
           <b v-if="agence.abonnement == 'SPIDER'">
            Vous avez choisi cet abonnement le 
          </b>
      </div>
      <div class=" itemOffer">
          <h1 class="title">
              <i class="fas fa-dragon ">
              </i>&nbsp;&nbsp;
              L'offre DRAGON
          </h1>
          <div>
              Aucune limite
          </div>          
            <div>
            100€ par mois
          </div><br/>
           <button class="button is-primary" v-on:click="abonner('DRAGON')" v-if="agence.abonnement != 'DRAGON'">
              <i class="fas fa-check"/>&nbsp;
              <span>Je souscris</span>
          </button>
           <b v-if="agence.abonnement == 'DRAGON'">
            Vous avez choisi cet abonnement le 
          </b>
      </div>
      
    </div>
	</div>
</template>

<script>

import MyNavbar from "@/components/MyNavbar.vue";
import agence_api from '@/firebase/agence_api'
//import MyNavbarFooter from "@/components/MyNavbarFooter.vue";

export default {
  props:["agence"],
  name: "home",
  components: {
    MyNavbar    /*,
    MyNavbarFooter*/
  },
  methods:  {    
    abonner(type) {
      agence_api.api.abonner (this.agence, type);      
    },
    convertDate(timestamp) {
      var maDate  =new Date(timestamp.seconds * 1000);

      return this.formattedDate(maDate);
    },
    formattedDate(d = new Date) {
      return [d.getDate(), d.getMonth()+1, d.getFullYear()]
        .map(n => n < 10 ? `0${n}` : `${n}`).join('/');
    },
    save(fct) {
      this.$emit("save", "abonnement");
      fct(true);
    }
  }
};
</script>
<style scoped>
.listOffer {
    vertical-align: top;
    overflow-y: auto;
    height: 3000px;
    text-align: center;
}
.itemOffer {
    background-color: white;    
    height: 200px;
    width: 90%;
    display: inline-block;
    margin-bottom: 10px;
    float: left;
    color: black;
    padding-top: 30px;
    font-family: "Yu Gothic UI Light";
    border: thin solid silver;
  }

h1.title {
  font-size: large;  
  
}
</style>