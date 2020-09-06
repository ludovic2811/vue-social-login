<template>
<div>	
  <div>
  	
     <div  v-show="nav=='list'" class="contain"><br/>
     
         <s-button theme="is-primary" icon="plus" label="Ajouter un entrepot"  @onclick="add"></s-button>
              <br/><br/>
              <ul>
                <li v-for="entrepot in $store.getters.getEntrepots" class="itemList">
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
    <edit-entrepot  @refresh="refresh" v-show="nav=='editEntrepot'" @back="nav='list'" :entrepot="entrepot" :account="account" ></edit-entrepot>

</div>

</template>
<script>

import entrepot_api from '@/firebase/entrepot_api'
import EditEntrepot from '@/views/config/step/editEntrepot.vue'
export default {
  components: {
    EditEntrepot
  },
	data: function() {
		return {			
			account: {},
      nav: 'list',
      entrepot: {},
      errorEntrepot: false
		}
	},
  methods: {
    add() {
      this.entrepot = JSON.parse(JSON.stringify(entrepot_api.api.json));
      this.nav='editEntrepot';
      this.$emit("hideNaviguation", false);
    },
    edit(entrepot) {    
      this.entrepot = entrepot ;
      this.nav='editEntrepot';
      this.$emit("hideNaviguation", false);
    },
    refresh() {
      this.nav="list";
       this.$emit("hideNaviguation", true);
    },
    save(fct) {
       this.errorEntrepot = false;
       if (this.$store.getters.getEntrepots.length > 0)
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