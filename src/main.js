import Vue from 'vue'
import App from './App.vue'
import router from './router'

import './registerServiceWorker'

import firebase 		from 'firebase'
import 'firebase/firestore'
import util 			from '@/firebase/util'
import firebase_api 	from '@/firebase/firebase_api'
import vuefire 			from "@/firebase/vuefire"
import VueFirestore from 'vue-firestore'
import SButton 			from '@/components/SButton.vue'
import SSelect 			from '@/components/SSelect.vue'
import SModal  			from '@/components/SModal.vue'	
import SConfirm  			from '@/components/SConfirm.vue'	
import MyNavbar 		from "@/components/MyNavbar.vue";

import MyNavbarFooter 	from "@/components/MyNavbarFooter.vue";

import VCalendar 		from 'v-calendar';
import SDraggable 		from "@/components/SDraggable"

var currentUser = null;

Vue.use(VCalendar);
Vue.use(VueFirestore);

Vue.component("SModal", SModal);
Vue.component("SButton", SButton);
Vue.component("SSelect", SSelect);
Vue.component("SModal", SModal);
Vue.component("SConfirm", SConfirm);
Vue.component("SDraggable", SDraggable);


Vue.component("MyNavbar", MyNavbar);
Vue.component("MyNavbarFooter", MyNavbarFooter);

Vue.config.productionTip = false
Vue.prototype.$steps = 7;
Vue.prototype.$uuid = function() {
	return util.util.uuid();
}
Vue.prototype.$orderJson = function(jsonParam) {
	  return util.util.order(jsonParam);
}
Vue.prototype.$updateRang = function(inArray, outArray) {
  		util.util.updateRang(inArray, outArray);
}
let app = '';

firebase_api.api.init(this);

firebase.auth().onAuthStateChanged(() => {
		let storeInst = vuefire.store;

		storeInst.dispatch('init', ()=> {
			
		//storeInst.dispatch('initAgence', storeInst.getters.getUser.idAgenceSelected)
		//storeInst.dispatch('bindAgenceFire', storeInst.getters.getUser.idAgenceSelected);
			if (!app) {
				    app = new Vue({
				      router,
				      store: storeInst,

				      render: h => h(App)
				    }).$mount('#app');
				}
			}	
		);
})
