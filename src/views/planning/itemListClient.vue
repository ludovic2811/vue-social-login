<template>
    <div class="itemGlobalInOut">
        <div class="itemClientInOut" >
            <s-button icon="eye" label="" theme="is-primary" @onclick="openClientItem(itemInOut)"/>
            &nbsp;{{itemInOut.client.nom}} {{itemInOut.client.prenom}}
        </div>
        <div class="itemArticleInOut">
            <div  >
                <i :class="getClassCategorie(itemInOut.article.idCategorie)"/> {{itemInOut.article.numero}}
            &nbsp;<s-button 
                :label="getLabelEtat(itemInOut.article.idEtat)" 
                :icon="getClassEtat(itemInOut.article.idEtat)"  
                theme="is-primary is-small" 
                @onclick="openModalEtat=true"/>
            
            <s-select-etat :open="openModalEtat" :article="itemInOut.article"
                @save="save(itemInOut)" @cancel="openModalEtat=false"
            >
            </s-select-etat>
            </div>
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
        getLabelEtat(idEtat) {
            return this.$store.getters.getAgence.etats[idEtat].nom;
            
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
        border: thin solid black;
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
    .itemArticleInOut div {
        margin-top: 20px;
        margin-left: 100px;
    }
</style>