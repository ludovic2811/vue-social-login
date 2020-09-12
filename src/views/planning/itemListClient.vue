<template>
    <div class="itemGlobalInOut">
    	<s-button icon="eye" label="" theme="is-primary" @onclick="openClientItem(itemInOut)"/>
        
        <div class="itemClientInOut">
            {{itemInOut.client.nom}} {{itemInOut.client.prenom}} :
            <i :class="getClassCategorie(itemInOut.article.idCategorie)"/> {{itemInOut.article.numero}}
        </div>
        

        <div style="float:right">
        <s-button 
            :label="getLabelEtat(itemInOut.article.idEtat)" 
            :icon="getClassEtat(itemInOut.article.idEtat)"  
            theme="is-primary " 
            @onclick="openModalEtat=true"/>
         
        <s-select-etat :open="openModalEtat" :article="itemInOut.article"
            @save="save(itemInOut)" @cancel="openModalEtat=false"
        >
        </s-select-etat>
        </div>
    </div>
</template>
<script>
import client_api from "@/firebase/client_api"
import article_api from "@/firebase/article_api"

import SSelectEtat from '@/views/client/components/SSelectEtat.vue'
    
export default {
    props:["itemInOut"],
    data: function() {
        return {
            openModalEtat: false
        }
    },
    components: {
        SSelectEtat
    },
    methods: {
       
        openClientItem(itemInOut) {
			 this.$emit("openClientItem", itemInOut.client)
		},
        getClassCategorie(idCategorie) {
				return this.$store.getters.getAgence.categories[idCategorie].icon;
			},
        getClassEtat(idEtat) {
            return this.$store.getters.getAgence.etats[idEtat].icon;
            
        },
        getLabelEtat(indexEtat) {
            var index = this.$store.getters.getEtats.findIndex(elt=>elt.id == indexEtat);
            if (index!=-1) {
                return this.$store.getters.getEtats[index].nom;
            }
            return "";
        },
        save(itemInOut) {
				
				article_api.api.save(this.$store, itemInOut.client,()=>{
					client_api.api.get(this.$store, itemInOut.idClient, itemClient=>{
                        itemInOut.article = itemClient.articles[itemInOut.numero];
                        itemInOut.client = itemClient;
                        this.openModalEtat = false;
					})
				});
		}
    }
}
</script>
<style scoped>
    .itemGlobalInOut {
        
        padding: 5px;        
        margin-bottom: 5px;
    }
    .itemClientInOut {
        width: 350px;
        display:inline-block;
        height: 20px;
        padding-left: 20px;
        padding-top: 5px;
        vertical-align: middle;
    }
</style>