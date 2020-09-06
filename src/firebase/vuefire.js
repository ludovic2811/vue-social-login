import { vuexfireMutations, firestoreAction } from 'vuexfire'
import user_api from "@/firebase/user_api"; 
import firebase from "@/firebase/firebase_api"; 
import Vue from "vue"
import Vuex from 'vuex'
Vue.use(Vuex)

const store = new Vuex.Store({
  // setup the reactive todos property
  state: {
    userFire: {
    	
    },
    agence: {

    },
    docAgence: null,
    etats: [],
    categories: [],
    entrepots: []
  },

  mutations: vuexfireMutations,
  getters: {
  	getUser: state => {
    	return state.userFire;
  	},
  	getAgence: state => {
  		return state.agence;
  	},
  	getEtats: state => {
  		return state.etats;
  	},
  	getCategories: state => {
  		return state.categories;
  	},
  	getEntrepots: state=> {
  		return state.entrepots;
  	},
  	getDocAgence: state=> {
  		return state.docAgence
  	}
  // other getters
  },

  actions: {
  	init: firestoreAction((context, fct)=>{
      if (firebase.api.getUser()!=null) {
        context.bindFirestoreRef('userFire', firebase.api.getDb().collection('user').doc(firebase.api.getUser().uid), {wait: true})
          .then((res) => {
             
             if (res!=null)
              if (res.idAgenceSelected != "") {
                
                var params = {
                  idAgence: res.idAgenceSelected,
                  fct: ()=>{
                    fct()
                  }
                }
      	       context.dispatch("initAgence", params);
              }
              else fct();
             else
              fct();
          })
          .catch((err) => {
            console.log("error : " +err);
            reject(err)
          })
      }
      else {
        fct();
      }
  	}),
  	setAgence: firestoreAction((context, params)=> {
  		user_api.api.setAgenceSelected(
  				firebase.api.getDb().collection('user').doc(firebase.api.getUser().uid), 
  				params.idAgence,
  				user=>{
  					context.dispatch("initAgence", params);
  				}
  		)
  	}),
  	initAgence: firestoreAction((context, params)=>{
  		context.bindFirestoreRef('agence', firebase.api.getDb().collection('agence').doc(params.idAgence), {wait: true})
  		.then(res=>{
  			context.state.docAgence = firebase.api.getDb().collection('agence').doc(params.idAgence);
  			context.dispatch("initEtat", ()=> {
          context.dispatch("initCategories", ()=>{
            context.dispatch("initCategories", ()=>{
              context.dispatch("initEntrepots", params.fct);  
            })
          })           
  		  })
      })
  	}),
  	initEtat: firestoreAction((context, fct) => {
  		context.bindFirestoreRef("etats", 
  			firebase.api.getDb().collection('agence').doc(context.getters.getUser.idAgenceSelected).collection("etats")
  			).then(res=>{      
         fct();
        })
  	}),
  	initCategories: firestoreAction((context, fct) => {
  		context.bindFirestoreRef("categories", 
  			firebase.api.getDb().collection('agence').doc(context.getters.getUser.idAgenceSelected).collection("categories")
  		).then(res=>{
         fct();
        })
  	}),
  	initEntrepots: firestoreAction((context, fct) => {
  		context.bindFirestoreRef("entrepots", 
  			firebase.api.getDb().collection('agence').doc(context.getters.getUser.idAgenceSelected).collection("entrepots")
  		).then(res=>{
         fct();
        })
  	}),
  }
})

export default {
	store: store
}