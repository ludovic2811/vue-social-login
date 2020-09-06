import Vue from 'vue'
import App from './App.vue'
import router from './router'

import './registerServiceWorker'

import firebase 		from 'firebase'
import 'firebase/firestore'
import firebase_api 	from '@/firebase/firebase_api'
import vuefire 			from "@/firebase/vuefire"

import SButton 			from '@/components/SButton.vue'
import SSelect 			from '@/components/SSelect.vue'
import SModal  			from '@/components/SModal.vue'	
import SConfirm  			from '@/components/SConfirm.vue'	
import MyNavbar 		from "@/components/MyNavbar.vue";

import MyNavbarFooter 	from "@/components/MyNavbarFooter.vue";

import VCalendar 		from 'v-calendar';

var currentUser = null;

Vue.use(VCalendar);

Vue.component("SButton", SButton);
Vue.component("SSelect", SSelect);
Vue.component("SModal", SModal);
Vue.component("SConfirm", SConfirm);

Vue.component("MyNavbar", MyNavbar);
Vue.component("MyNavbarFooter", MyNavbarFooter);

Vue.config.productionTip = false
Vue.prototype.$steps = 7;

let app = '';

firebase_api.api.init(this);

firebase.auth().onAuthStateChanged(() => {
		let storeInst = vuefire.store;
		storeInst.dispatch('init', ()=> {
			console.log("bah alors");
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
