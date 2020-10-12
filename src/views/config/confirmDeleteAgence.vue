<template>
    <s-confirm :open="openModalSup" title="Supprimer l'agence" @yes="supprimerAgence" 
            @no="annuler">
			Etes vous sûr de vouloir suprimer l'agence 
            <b v-if="agence!=null">
                {{agence.nom}}</b> ?
	</s-confirm>
</template>
<script>
import firebase_api     from "@/firebase/firebase_api"; 
import agence_api       from "@/firebase/agence_api"; 
import vuefire 			from "@/firebase/vuefire"
export default {
    name: "deleteAgence",
    data: function() {
        return {
            agence: null,
            openModalSup: false
        }
    },
    methods: {
        annuler() {
           this.$router.push({ name: 'Config'});
          //   this.$router.replace("./config").catch(error=>{})
        },
        supprimerAgence() {
            agence_api.api.delete(this.$store, this.agence, ()=>{
                 let storeInst = vuefire.store;
                 storeInst.dispatch('init', ()=>{
                     this.$router.push({ name: 'Config'});
                 });
            })
        }
    },
    mounted() {
        if (typeof(this.$route.params.idAgence) != "undefined") {
            
            firebase_api.api.getDb().collection("agence").doc(this.$route.params.idAgence).get().then(agence=>{
                    this.agence = agence.data();
                    this.agence.id = agence.id;
               
                    this.openModalSup = true;
            })
        }
        else   
            this.$route("./config");
    }
		
    }

</script>