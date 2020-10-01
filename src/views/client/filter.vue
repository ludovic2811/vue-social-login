<template>
    <s-modal 
		:open="open" 
		title="Filtrer vos clients"
		:save="true" 
		:close="true"
		@save="applyFilter" 
		@close="$emit('cancel')">

        <div class="filterItem" v-on:click="onglet='entrepot'"> 
            <s-button 
                        icon="filter"
                        label=""
                        :theme="isCheckEntrepot() ? 'is-success is-small' : 'is-danger is-small'"
                        @onclick="">
                    </s-button>&nbsp;&nbsp;Par entrepots 
            <div class="icon">
                <i class="fas fa-angle-down"/>
            </div>
            <div v-if="onglet=='entrepot'">
                <div v-for="entrepot in arrayEntrepots" class="subitemFilter" >
                   <div :class="(entrepot.object.id == filterId) ? 'labelCheckSelected' : 'labelCheck'">
                        {{entrepot.object.nom}} 
                    </div>
                    <s-button 
                        :icon="(entrepot.object.id == filterId) ? 'check' : 'ban'"
                        label=""
                        :theme="(entrepot.object.id == filterId) ? 'is-success is-small' : 'is-danger is-small'"
                        @onclick="setFilter(entrepot.object.id)">
                    </s-button>
                </div>
            </div>
        </div>
        <div class="filterItem" v-on:click="onglet='etat'"> 
              <s-button 
                        icon="filter"
                        label=""
                        :theme="isCheckEtat() ? 'is-success is-small' : 'is-danger is-small'"
                        @onclick="">
                    </s-button>&nbsp;&nbsp;Par etats 
            <div class="icon">
                <i class="fas fa-angle-down"/>
            </div>
            <div v-if="onglet=='etat'">
                <div v-for="etat in arrayEtats" class="subitemFilter">
                    <div :class="(etat.object.id == filterId)  ? 'labelCheckSelected' : 'labelCheck'">
                        {{etat.object.nom}} 
                    </div>
                    <s-button 
                        :icon="(etat.object.id == filterId) ? 'check' : 'ban'"
                        label=""
                        :theme="(etat.object.id == filterId) ? 'is-success is-small' : 'is-danger is-small'"
                        @onclick="setFilter(etat.object.id)">
                    </s-button>
                </div>
            </div>
        </div>
        <div class="filterItem" v-on:click="onglet='categorie'"
           > <s-button 
                        icon="filter"
                        label=""
                        :theme="isCheckCategorie() ? 'is-success is-small' : 'is-danger is-small'"
                        @onclick="">
                    </s-button>&nbsp;&nbsp; 
            Par categorie 
            <div class="icon">
                 <i class="fas fa-angle-down"/>
            </div>
            <div v-if="onglet=='categorie'">
                <div v-for="category in arrayCategories" class="subitemFilter">
                    <div :class="(category.object.id == filterId) ? 'labelCheckSelected' : 'labelCheck'">
                        {{category.object.nom}} 
                    </div>
                    <s-button 
                        :icon="(category.object.id == filterId) ? 'check' : 'ban'"
                        label=""
                        :theme="(category.object.id == filterId) ? 'is-success is-small' : 'is-danger is-small'"
                        @onclick="setFilter(category.object.id)">
                    </s-button>
                </div>
            </div>
        </div>
    </s-modal>

</template>
<style scoped>
    .filterItem {
        border: thin black solid;
        padding: 5px;
        margin-bottom: 5px;
        font-weight: bold;
    }
    .filterItem:hover {
       cursor: pointer;
    }
    .icon {
        float: right;
    }
    .subitemFilter {
        padding-left: 30px;
        padding-top: 10px;
         font-weight: normal;
    }
    .labelCheck {
        width: 100px;
        display: inline-block;
        color: rgb(145, 2, 2);
    }
    .labelCheckSelected {
        width: 100px;
        display: inline-block;
        color: rgb(5, 107, 27);
    }
</style>
<script>
export default {
    props:['open', 'filter'],
    data() {
        return {
            arrayEntrepots: [],
            arrayCategories: [],
            arrayEtats: [],
            onglet:'',
            filterId: ''
        }
    },
    watch: {
        open: function(val) {
            this.filterId = this.filter;
        }
    },
    methods: {
        applyFilter() {
            this.$emit("save", this.filterId);
        },
        setFilter(id) {
            if (this.filterId == id)
                this.filterId = null;
            else
                this.filterId = id;
        },
        isCheckEntrepot() {
           return typeof(this.$store.getters.getAgence.entrepots[this.filterId]) != "undefined"
        },
        isCheckCategorie() {
            return typeof(this.$store.getters.getAgence.categories[this.filterId]) != "undefined"
        },
        isCheckEtat() {
            return typeof(this.$store.getters.getAgence.etats[this.filterId]) != "undefined"
        },
        
    },
    mounted() {
        this.arrayEntrepots  = this.$orderJson(this.$store.getters.getAgence.entrepots);
        this.arrayEtats  = this.$orderJson(this.$store.getters.getAgence.etats);
        this.arrayCategories  = this.$orderJson(this.$store.getters.getAgence.categories);
    }
}
</script>