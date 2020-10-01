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
    subscription: {

    },
    docSubscription: null
  },

  mutations: vuexfireMutations,
  getters: {
  	getUser: state => {
    	return state.userFire;
  	},
  	getAgence: state => {
  		return state.agence;
  	},  	
  	getDocAgence: state=> {
  		return state.docAgence
    },
    getSubscription: state=>{
      return state.subscription
    },
    getDocSubscription: state=>{
      return state.docSubscription
    }
  // other getters
  },

  actions: {
  	init: firestoreAction((context, fct)=>{
      if (firebase.api.getUser()!=null) {
        context.bindFirestoreRef('userFire', firebase.api.getDb().collection('user').doc(firebase.api.getUser().uid), {wait: true})
          .then((res) => {
             
             if (res!=null) {
              if (res.idAgenceSelected != "") {
                
                var params = {
                  idAgence: res.idAgenceSelected,
                  fct: ()=>{
                   
                    fct()
                  }
                }
      	       context.dispatch("initAgence", params);
              }
              else {
               
                fct();
              }
            }
             else {
              
              fct();
             }
              
          })
          .catch((err) => {
            console.log("error : " +err);
            reject(err)
          })
      }
      else {
        context.state.docAgence = null;
        context.state.agence = [];
        context.state.userFire = null;
        context.state.subscription = null;
        context.state.getDocSubscription = null;
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
        context.dispatch("setSubscription", params);
      })
      .catch(res=>{
        context.state.agence = {};
        context.state.docAgence = null;
        params.fct();
      })
    }),
    setSubscription: firestoreAction((context, params) => {
      
      context.bindFirestoreRef('subscription', firebase.api.getDb().collection('subscription').doc(context.state.agence.userIdCreated))
      .then(res=>{
        context.state.docSubscription = firebase.api.getDb().collection('subscription').doc(context.state.agence.userIdCreated); 
        params.fct();
      })
    })
  }
})

export default {
	store: store
}