<template>
<div>	
  <div>
  	
     <div  class="contain"><br/>
         <s-button theme="is-primary" icon="plus" label="Ajouter un entrepot"  @onclick="add"></s-button>
              <br/><br/>
              <ul>
                <li v-for="entrepot in this.agence.entrepots" class="itemList">
                  <s-button theme="is-primary" icon="cog" :label="entrepot.nom"  @onclick="edit(entrepot)"></s-button>
                 <br/><br/>
                </li>
              </ul>
      </div>
    </div>
    <div class="notification is-danger" v-show="errorEntrepot">
      <button class="delete" v-on:click="errorEntrepot=false"></button>
      Il faut au moins un entrepot !
    </div>
    <div :class="modalEdit">
      
       <edit-entrepot  @refresh="refresh=!refresh" :refresh="refresh" @back="modalEdit='modal'" :entrepot="entrepot" :agence="agence" ></edit-entrepot>
     
    </div>
    
   

</div>

</template>
<script>

import entrepot_api from '@/firebase/entrepot_api'
import EditEntrepot from '@/views/config/step/editEntrepot.vue'
export default {
  props : ["agence"],
  components: {
    EditEntrepot
  },
	data: function() {
		return {		
      modalEdit: 'modal',
      entrepot: {},
      errorEntrepot: false,
      refresh: false
		}
	},
  methods: {
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
       this.$emit("hideNaviguation", true);
    },
    save(fct) {
       this.errorEntrepot = false;
       if (Object.keys(this.agence.entrepots).length > 0)
          fct(true);
       else {
          this.errorEntrepot = true;
          fct(false);
       }
    }
  }
}
</script>
<style scoped>
  .itemList {
    list-style-type:none;
  }
</style>