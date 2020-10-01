<template>
<div>	
  <div>
  	
     <div ><br/>
         <s-button theme="is-primary" icon="plus" label="Ajouter un entrepot"  @onclick="add"></s-button>
              <s-draggable :refresh="refreshDrag" draggable=".itemDraggable" :datas="dataCollectionArray" @sortData="sort">
                  <div v-for="entrepot in dataCollectionArray" :key="entrepot.id" class="itemDraggable" >
                      <i class="fas fa-arrows-alt-v"/>
                      <div class="itemEntrepot">
                        <i :class="entrepot.object.icon"/>
                        &nbsp;{{entrepot.object.nom}}	
                      </div>
                      <s-button theme="is-primary" label="" icon="cog" @onclick="edit(entrepot.object)"/>
                      </div>
              </s-draggable>
             
               
               
      </div>
    </div>
    <div class="notification is-danger" v-show="errorEntrepot">
      <button class="delete" v-on:click="errorEntrepot=false"></button>
      Il faut au moins un entrepot !
    </div>
    <div :class="modalEdit">
      
       <edit-entrepot  @refresh="refreshEdit=!refreshEdit" :refresh="refreshEdit" @back="back" :entrepot="entrepot" :agence="agence" ></edit-entrepot>
     
    </div>
    
   

</div>

</template>
<style scoped>
  .itemList {
    list-style-type:none;
  }
  .itemDraggable {
		border: thin solid rgb(187, 184, 184);
		margin-top: 5px;
		margin-right: 5px;
		padding: 5px;
	}
  .itemDraggable:hover {
		cursor: grab
	}
  .itemEntrepot {
		display: inline-block;
		margin-top: 5px;
		width: 150px;
		padding-left: 15px;
    
	}
</style>
<script>

import entrepot_api from '@/firebase/entrepot_api'
import EditEntrepot from '@/views/config/step/editEntrepot.vue'
export default {
  props : ["agence","refresh"],
  components: {
    EditEntrepot
  },
	data: function() {
		return {		
      dataCollectionArray: [],
      modalEdit: 'modal',
      entrepot: {},
      errorEntrepot: false,
      refreshDrag: false,
      refreshEdit: false
		}
  },
  watch: {
    refresh: function(val) {
       this.dataCollectionArray = 	this.$orderJson(this.agence.entrepots);
    }
  },
  methods: {
    sort(myArray) {
				this.$updateRang(myArray, this.dataCollectionArray);
				this.refreshDrag = !this.refreshDrag;
			},
    add() {
      this.entrepot = JSON.parse(JSON.stringify(entrepot_api.api.json));
      this.entrepot.id = this.$uuid();
      this.modalEdit='modal is-active';
      this.$emit("hideNaviguation", false);
    },
    edit(entrepot) {    
      this.entrepot = entrepot ;
       this.modalEdit='modal is-active';
      this.$emit("hideNaviguation", false);
    },
    back() {
       this.modalEdit='modal';
       
       this.$emit("refresh");
       
       this.$emit("hideNaviguation", true);
    },
    save(fct) {
       this.errorEntrepot = false;
       this.dataCollectionArray = 	this.$orderJson(this.agence.entrepots);
       if (Object.keys(this.agence.entrepots).length > 0)
          fct(true);
       else {
          this.errorEntrepot = true;
          fct(false);
       }
    }
  },
  mounted() {
			this.dataCollectionArray = 	this.$orderJson(this.agence.entrepots);
			
		}
}
</script>
