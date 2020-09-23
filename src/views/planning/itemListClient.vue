<template>
    <div class="itemGlobalInOut">
        <div class="itemClientInOut" >
            <s-button icon="eye" label="" theme="is-primary" @onclick="openClientItem(itemInOut)"/>
            &nbsp;{{itemInOut.client.nom}} {{itemInOut.client.prenom}}
        </div>
        <div class="itemArticleInOut">
            <div class="article">
                    <i :class="getClassCategorie(itemInOut.article.idCategorie)"/> {{itemInOut.article.numero}} {{itemInOut.article.complement}}
            </div>
            <div class="buttons">
                <s-button 
                :label="getLabelEntrepot(itemInOut.article)" 
                icon=""  
                theme="is-primary is-small" 
                @onclick="openModalEntrepotTrue()"/>&nbsp;
               <s-button 
                :label="getLabelEtat(itemInOut.article.idEtat)" 
                :icon="getClassEtat(itemInOut.article.idEtat)"  
                theme="is-primary is-small" 
                @onclick="openModalEtatTrue()"/>&nbsp;
                <div v-if="article!=null">
                <s-select-entrepot
                    :open="openModalEntrepot"
                    :article="article"
                    @save="save()"
                    @cancel="openModalEntrepot=false"
                   
                />
               
                <s-select-etat 
                    :open="openModalEtat" 
                    :article="article"
                    @save="save()" @cancel="openModalEtat=false"
                   
                >
                </s-select-etat>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import client_api from "@/firebase/client_api"
import article_api from "@/firebase/article_api"
import SSelectEntrepot from '@/views/client/components/SSelectEntrepot.vue'
import SSelectEtat from '@/views/client/components/SSelectEtat.vue'
    
export default {
    props:["itemInOut"],
    data: function() {
        return {
            openModalEtat: false,
            openModalEntrepot: false,
            article: JSON.parse(JSON.stringify(this.itemInOut.article))
        }
    },
    components: {
        SSelectEtat,
        SSelectEntrepot
    },
    methods: {
       openModalEtatTrue() {
           this.openModalEtat = true;
           this.article = JSON.parse(JSON.stringify(this.itemInOut.article));
       },
       openModalEntrepotTrue() {
           this.openModalEntrepot = true;
           this.article = JSON.parse(JSON.stringify(this.itemInOut.article));
       },
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
        getLabelEntrepot(article) {
            var entrepot = this.$store.getters.getAgence.entrepots[article.idEntrepot];
            var stock = entrepot.stocks[article.idStock];
            return entrepot.nom +  " / " + stock.nom;
        },
        
        save(articleDelete) {
                article_api.api.save(this.$store, this.itemInOut.client, this.article, articleDelete, ()=>{
                        this.openModalEtat = false;
                        this.openModalEntrepot = false;
                        this.itemInOut.article = this.article;
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
    .itemArticleInOut div.article {
        margin-top: 10px;
        margin-left: 70px;
    }
    .itemArticleInOut div.buttons {
        margin-top: 5px;
        margin-left: 40px;
    }
</style>