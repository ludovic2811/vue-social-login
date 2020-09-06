<template>
  <section class="section">
  <div class="container">
    <div v-if="$store.getters.getDocAgence == null">
      Aucune agence sélectionnée ...
      <s-button theme="is-primary" label="Configurer vos agences" icon="cog" @onclick="$router.push('/config')">
      </s-button>
    </div>
    <div class="listGroup" v-if="$store.getters.getDocAgence != null">
        <div class="item_group">
          <nav class="level is-mobile">
  <!-- Left side -->
              <div class="level-left">
                <div class="level-item">
                  <p class="subtitle is-5">
                    <s-button theme="is-primary" icon="cog" label="" @onclick="$router.push('/config')">
                    </s-button>
                  </p>
                </div>
                <div class="level-item">
                  <div class="field has-addons">
                    <p class="label">
                      <b>Agence</b>
                         
                    </p>                    
                  </div>
                </div>
              </div>
            </nav>
            <s-button theme="is-primary" label="Liste de tous vos clients" icon="list" @onclick="$router.push('/listClient')"/><br/><br/>
            <s-button theme="is-primary" label="Clients dont un des articles est sorti" icon="sign-out-alt" @onclick=""/><br/><br/>
            <s-button theme="is-primary" label="Clients où  tous les articles sont rentrés" icon="pallet" @onclick=""/><br/><hr/>
            <s-button theme="is-danger" label="Liste de vos impayés" icon="file-invoice-dollar" @onclick=""/><br/><br/>
            <s-button theme="is-info" label="Planning" icon="calendar-alt" @onclick="$router.push('/planning')"/><br/><br/>
            
            <s-button theme="is-warning" label="Evènements" icon="info" @onclick=""/><br/><br/>
        </div>
    </div>
   </div>
  </section>
</template>

<script>
import firebase from "firebase";

import user_api from '@/firebase/user_api'


//import MyNavbarFooter from "@/components/MyNavbarFooter.vue";
export default {
  name: "home",
  components: {
   
  },
  data: function() {
    const todos = [
      {
        description: 'Take Noah to basketball practice.',
        isComplete: false,
        dates: { weekdays: 6 }, // Every Friday
        color: 'red',
      },
    ];
    return {
      incId: todos.length,
      todos,
      nav: "",
      account: {},
      attrs: [
      {
        
          dot: {
            color: 'red',
            class: 'my-dot-class',
          },
          dates: [
            new Date(2020, 7, 1), // Jan 1st
            new Date(2020, 7, 10), // Jan 10th
            new Date(2020, 7, 22), // Jan 22nd
          ]
        }
      ]
   } 
  }
  ,
  computed: {
    attributes() {
      return [
        // Attributes for todos
        ...this.todos.map(todo => ({
          dates: todo.dates,
          dot: {
            color: todo.color,
            class: todo.isComplete ? 'opacity-75' : '',
          },
          // We need to at least pass a truthy value for the popover to appear
          // Pass an object to customize popover settings like visibility, placement, etc.
          popover: true,
          customData: todo,
        })),
      ];
    },
  },  
  methods:  {

    setNav(nav) {
      this.nav = nav;
    }
  },
  mounted() {
    console.log("mounted");
   // this.$store.dispatch('bindUserFire');
    console.log(this.$store.getters.getUser);
    console.log(this.$store.getters.getAgence);
  //  console.log(this.$userGlobal);
     /* compte_api.api.get(account=> {
            this.account = account;
      })*/
  }
  
};
</script>

<style scoped>
.item_group {
    background-color: white;    
    height: 450px;
    width: 350px;
    display: inline-block;
    padding: 10px;
    float: left;
    color: black;
    margin: 5px;
    font-family: "Yu Gothic UI Light";
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
     text-align: left;
}
.listGroup {
    vertical-align: top;
    overflow-y: scroll;
    height: 3000px;
    text-align: left;
}
</style>