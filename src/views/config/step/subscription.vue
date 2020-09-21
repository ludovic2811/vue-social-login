<template>
 <div >
  <div class=" listOffer is-mobile">
      
       <div class=" itemOffer" v-for="product in listProducts">
          <h1 class="title">
               <img :src="product.image" height="60" width="60"/>
              </i>&nbsp;&nbsp; {{product.nom}}
          </h1>
          <div>
               {{product.description}} &nbsp;
               <b>{{product.price.unit_amount / 100}} € par mois</b>
          </div>   
          <button :class="theme" :disabled="disabled" v-on:click="subscribe(product.priceId)">
              <i class="fas fa-check"/>&nbsp;
              <span>Je souscris</span>
          </button>
      </div>
  </div>
	</div>
</template>

<script>

import MyNavbar from "@/components/MyNavbar.vue";
import agence_api from '@/firebase/agence_api'
import firebase_api from '@/firebase/firebase_api'
import subscription_api from '@/firebase/subscription_api'

//import MyNavbarFooter from "@/components/MyNavbarFooter.vue";

export default {
  
  name: "home",
  
  data() {
    return {
      listProducts: [],
      subscriptionPriceId: "",
      theme: "button is-primary is-small",
      disabled: false
    }
  },
  components: {
    MyNavbar    /*,
    MyNavbarFooter*/
  },
  methods:  {  
    resilier(idCust, idSub) {
      subscription_api.api.SetCancelSubscribe(idCust, idSub);
    },
    subscribe(priceId) {
      this.theme = "button is-loading is-success is-small";
      this.disabled = true;
      var successUrl = window.location.origin + "/config"
      var cancelUrl = window.location.origin + "/config"
      subscription_api.api.subscribe (this.$store.getters.getUser.id, 
          priceId, successUrl,cancelUrl);
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
  },
  mounted() {
      subscription_api.api.getProducts(product=>{
         this.listProducts.push(product)
      })
  }
};
</script>
<style scoped>
.listOffer {
    vertical-align: top;
    
    text-align: center;
}
.itemOffer {
    background-color: white;    
    height: 170px;
    width: 90%;
    display: inline-block;
    margin-bottom: 5px;
    float: left;
    color: black;
    padding-top: 5px;
    font-family: "Yu Gothic UI Light";
    border: thin solid silver;
  }
  .itemOffer div {
    margin-bottom: 5px;
  }
h1.title {
  font-size: large;  
  
}
</style>