<template>
    <div class="container">
        <my-navbar ></my-navbar>
	 <my-navbarFooter ></my-navbarFooter>
        <br/>
    <nav class="level">
    <div class="level-item has-text-centered">
        <div>
        <p class="heading">Clients</p>
        <p class="title">{{$store.getters.getAgence.nbClients}}</p>
        </div>
    </div>
    <div class="level-item has-text-centered">
        <div>
        <p class="heading">Articles</p>
        <p class="title">{{$store.getters.getAgence.nbArticles}}</p>
        </div>
    </div>
    <div class="level-item has-text-centered">
        <div>
        <p class="heading">CA {{yearCurrent()}}</p>
        <p class="title">{{getTotal()}} €</p>
        </div>
    </div>
    <div class="level-item has-text-centered">
        <div>
        <p class="heading">Espace restant</p>
        <p class="title">{{reste}}</p>
        </div>
    </div>
    <div class="level-item has-text-centered">
        <div>
        <p class="heading">Espace Total</p>
        <p class="title">{{capacite}}</p>
        </div>
    </div>
    
    </nav>
    <div >
        <div class="tile is-ancestor">
            <div  class="tile is-parent">
                <div class="tile is-child box" >
                    <div class="content">
                    <entrepots-report></entrepots-report>
                    </div>
                </div>
            <div  class="tile is-parent">
                <div class="tile is-child box" >
                     <div class="content">
                    <etats-report></etats-report>
                     </div>
                </div>
            </div>
            </div>
            
        </div>
        <div class="tile is-ancestor">
             <div class="tile is-parent">
                 <div class="tile is-child box" >
                      <div class="content">
                    <etats-categories></etats-categories>   
                      </div>
                 </div>     
             </div>
             <div class="tile is-parent">
                 <div class="tile is-child box" >
                      <div class="content">
                    <ca-report></ca-report>   
                      </div>
                 </div>     
             </div>
        </div>
    </div>
</div>
</template>
<script>
import EntrepotsReport from "@/views/reporting/entrepotsReport"
import EtatsReport from "@/views/reporting/etatsReport"
import EtatsCategories from "@/views/reporting/categoryReport"
import CaReport from "@/views/reporting/caReport"
export default {
    components: {
        EntrepotsReport,
        EtatsReport,
        EtatsCategories,
        CaReport
    },
    data: function() {
        return {
            capacite: 0,
            reste: 0
        }
    },
    methods: {
        yearCurrent() {
              var date = new Date();
              return  date.getFullYear();        
        },
        getTotal() {
            if (typeof(this.$store.getters.getAgence.paiements) != "undefined") {
                if (typeof(this.$store.getters.getAgence.paiements[this.yearCurrent()]) != "undefined") {
                    return this.$store.getters.getAgence.paiements[this.yearCurrent()].total;
                }
                else
                    return 0;
            } else return 0;
        }

    },
    mounted() {
        this.capacite = 0;
        this.reste = 0;
            for (var key in this.$store.getters.getAgence.entrepots) {
                this.capacite += parseInt(this.$store.getters.getAgence.entrepots[key].capacite);                
                this.reste += parseInt(this.$store.getters.getAgence.entrepots[key].reste);      
            }
    }
  
}
</script>
